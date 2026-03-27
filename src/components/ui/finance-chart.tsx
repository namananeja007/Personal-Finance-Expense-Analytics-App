/* eslint react/jsx-handler-names: "off" */
import React, { useMemo, useCallback } from 'react';
import { AreaClosed, Line, Bar } from '@visx/shape';
import { curveMonotoneX } from '@visx/curve';
import { GridRows, GridColumns } from '@visx/grid';
import { scaleTime, scaleLinear } from '@visx/scale';
import { withTooltip, Tooltip, TooltipWithBounds, defaultStyles } from '@visx/tooltip';
import { WithTooltipProvidedProps } from '@visx/tooltip/lib/enhancers/withTooltip';
import { localPoint } from '@visx/event';
import { LinearGradient } from '@visx/gradient';
import { max, extent, bisector } from '@visx/vendor/d3-array';
import { timeFormat } from '@visx/vendor/d3-time-format';

// Replaced AppleStock with a generic FinancialData type suitable for our transactions
export type FinancialData = { date: string; close: number };
type TooltipData = FinancialData;

export const background = 'rgba(15, 23, 42, 0.4)';
export const background2 = 'rgba(2, 6, 23, 0.8)';
export const accentColor = '#10b981';
export const accentColorDark = '#34d399';
const tooltipStyles = {
  ...defaultStyles,
  background: '#1e293b',
  border: '1px solid rgba(255, 255, 255, 0.1)',
  color: 'white',
  borderRadius: '8px',
};

const formatDate = timeFormat("%b %d, '%y");

const getDate = (d: FinancialData) => new Date(d.date);
const getStockValue = (d: FinancialData) => d.close;
const bisectDate = bisector<FinancialData, Date>((d) => new Date(d.date)).left;

export type ComponentProps = {
  data: FinancialData[];
  width: number;
  height: number;
  margin?: { top: number; right: number; bottom: number; left: number };
};

const ComponentLogic = ({
  data,
  width,
  height,
  margin = { top: 10, right: 10, bottom: 20, left: 10 },
  showTooltip,
  hideTooltip,
  tooltipData,
  tooltipTop = 0,
  tooltipLeft = 0,
}: ComponentProps & WithTooltipProvidedProps<TooltipData>) => {
  if (width < 10 || !data || data.length === 0) return null;

  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;

  const dateScale = useMemo(
    () =>
      scaleTime({
        range: [margin.left, innerWidth + margin.left],
        domain: extent(data, getDate) as [Date, Date],
      }),
    [innerWidth, margin.left, data],
  );
  
  const stockValueScale = useMemo(
    () =>
      scaleLinear({
        range: [innerHeight + margin.top, margin.top],
        domain: [0, (max(data, getStockValue) || 0) + innerHeight / 3],
        nice: true,
      }),
    [margin.top, innerHeight, data],
  );

  const handleTooltip = useCallback(
    (event: React.TouchEvent<SVGRectElement> | React.MouseEvent<SVGRectElement>) => {
      const { x } = localPoint(event) || { x: 0 };
      const x0 = dateScale.invert(x);
      const index = bisectDate(data, x0, 1);
      const d0 = data[index - 1];
      const d1 = data[index];
      let d = d0;
      if (d1 && getDate(d1)) {
        d = x0.valueOf() - getDate(d0).valueOf() > getDate(d1).valueOf() - x0.valueOf() ? d1 : d0;
      }
      if (d) {
        showTooltip({
          tooltipData: d,
          tooltipLeft: x,
          tooltipTop: stockValueScale(getStockValue(d)),
        });
      }
    },
    [showTooltip, stockValueScale, dateScale, data],
  );

  return (
    <div style={{ position: 'relative' }}>
      <svg width={width} height={height}>
        <rect
          x={0}
          y={0}
          width={width}
          height={height}
          fill="url(#area-background-gradient)"
          rx={16}
        />
        <LinearGradient id="area-background-gradient" from={background} to={background2} />
        <LinearGradient id="area-gradient" from={accentColor} to={accentColor} toOpacity={0.1} />
        <GridRows
          left={margin.left}
          scale={stockValueScale}
          width={innerWidth}
          strokeDasharray="1,3"
          stroke={accentColor}
          strokeOpacity={0.1}
          pointerEvents="none"
        />
        <GridColumns
          top={margin.top}
          scale={dateScale}
          height={innerHeight}
          strokeDasharray="1,3"
          stroke={accentColor}
          strokeOpacity={0.05}
          pointerEvents="none"
        />
        <AreaClosed<FinancialData>
          data={data}
          x={(d) => dateScale(getDate(d)) ?? 0}
          y={(d) => stockValueScale(getStockValue(d)) ?? 0}
          yScale={stockValueScale}
          strokeWidth={2}
          stroke="url(#area-gradient)"
          fill="url(#area-gradient)"
          curve={curveMonotoneX}
        />
        <Bar
          x={margin.left}
          y={margin.top}
          width={innerWidth}
          height={innerHeight}
          fill="transparent"
          rx={14}
          onTouchStart={handleTooltip}
          onTouchMove={handleTooltip}
          onMouseMove={handleTooltip}
          onMouseLeave={() => hideTooltip()}
        />
        {tooltipData && (
          <g>
            <Line
              from={{ x: tooltipLeft, y: margin.top }}
              to={{ x: tooltipLeft, y: innerHeight + margin.top }}
              stroke={accentColorDark}
              strokeWidth={2}
              pointerEvents="none"
              strokeDasharray="4,4"
            />
            <circle
              cx={tooltipLeft}
              cy={tooltipTop}
              r={6}
              fill={accentColorDark}
              stroke="white"
              strokeWidth={2}
              pointerEvents="none"
            />
          </g>
        )}
      </svg>
      {tooltipData && (
        <div>
          <TooltipWithBounds
            key={Math.random()}
            top={tooltipTop - 12}
            left={tooltipLeft + 12}
            style={tooltipStyles}
          >
            {`$${getStockValue(tooltipData).toFixed(2)}`}
          </TooltipWithBounds>
          <Tooltip
            top={innerHeight + margin.top}
            left={tooltipLeft}
            style={{
              ...defaultStyles,
              background: 'transparent',
              color: 'var(--text-muted)',
              border: 'none',
              boxShadow: 'none',
              minWidth: 72,
              textAlign: 'center',
              transform: 'translateX(-50%)',
            }}
          >
            {formatDate(getDate(tooltipData))}
          </Tooltip>
        </div>
      )}
    </div>
  );
};

export const VisxFinanceChart = withTooltip<ComponentProps, TooltipData>(ComponentLogic);
