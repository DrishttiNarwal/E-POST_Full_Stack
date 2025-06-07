// src/components/ui/chart.tsx (or relevant path)
// Removed "use client" directive

import * as React from "react";
import * as RechartsPrimitive from "recharts";

import { cn } from "../../lib/utils"; // Assuming this path is correct

// Defines themes for applying styles (currently only light/dark)
const THEMES = { light: "", dark: ".dark" } as const;

// --- Chart Configuration Type ---
// Defines how different data keys should be represented (label, icon, color)
export type ChartConfig = {
  [k in string]: {
    label?: React.ReactNode;
    icon?: React.ComponentType;
  } & (
    // Can define color directly OR provide theme-specific colors
    | { color?: string; theme?: never }
    | { color?: never; theme: Record<keyof typeof THEMES, string> }
  );
};

// --- Chart Context ---
// Provides the chart configuration down the component tree
type ChartContextProps = {
  config: ChartConfig;
};

const ChartContext = React.createContext<ChartContextProps | null>(null);

// Custom hook to access the chart configuration context
function useChart() {
  const context = React.useContext(ChartContext);
  if (!context) {
    throw new Error("useChart must be used within a <ChartContainer />");
  }
  return context;
}

// --- Chart Container Component ---
// Main wrapper providing context and basic styling/structure
const ChartContainer = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div"> & {
    config: ChartConfig; // Configuration object for chart elements
    children: React.ComponentProps<
      typeof RechartsPrimitive.ResponsiveContainer
    >["children"]; // Expects content suitable for ResponsiveContainer
  }
>(({ id, className, children, config, ...props }, ref) => {
  const uniqueId = React.useId();
  // Create a unique ID for the chart for targeting styles
  const chartId = `chart-${id || uniqueId.replace(/:/g, "")}`;

  return (
    // Provide the config context to children
    <ChartContext.Provider value={{ config }}>
      <div
        data-chart={chartId} // Data attribute for CSS targeting
        ref={ref}
        className={cn(
          // Base styling for chart elements using CSS selectors
          // Targets recharts internal classes to apply theme-consistent styles
          "flex aspect-video justify-center text-xs [&_.recharts-cartesian-axis-tick_text]:fill-muted-foreground [&_.recharts-cartesian-grid_line[stroke='#ccc']]:stroke-border/50 [&_.recharts-curve.recharts-tooltip-cursor]:stroke-border [&_.recharts-dot[stroke='#fff']]:stroke-transparent [&_.recharts-layer]:outline-none [&_.recharts-polar-grid_[stroke='#ccc']]:stroke-border [&_.recharts-radial-bar-background-sector]:fill-muted [&_.recharts-rectangle.recharts-tooltip-cursor]:fill-muted [&_.recharts-reference-line_[stroke='#ccc']]:stroke-border [&_.recharts-sector[stroke='#fff']]:stroke-transparent [&_.recharts-sector]:outline-none [&_.recharts-surface]:outline-none",
          className // Allow overriding/extending styles
        )}
        {...props}
      >
        {/* Component to generate dynamic CSS variables based on config */}
        <ChartStyle id={chartId} config={config} />
        {/* Responsive container from recharts */}
        <RechartsPrimitive.ResponsiveContainer>
          {children}
        </RechartsPrimitive.ResponsiveContainer>
      </div>
    </ChartContext.Provider>
  );
});
ChartContainer.displayName = "ChartContainer"; // Set display name

// --- Chart Style Component ---
// Generates CSS variables for colors based on the config and theme
const ChartStyle = ({ id, config }: { id: string; config: ChartConfig }) => {
  const colorConfig = Object.entries(config).filter(
    ([_, config]) => config.theme || config.color // Filter for keys with color info
  );

  if (!colorConfig.length) {
    return null; // Don't render style tag if no colors are configured
  }

  return (
    <style
      // Use dangerouslySetInnerHTML to inject dynamic CSS
      dangerouslySetInnerHTML={{
        __html: Object.entries(THEMES)
          .map(
            ([theme, prefix]) => `
${prefix} [data-chart=${id}] { /* Target specific chart and theme */
${colorConfig
  .map(([key, itemConfig]) => {
    // Determine the color based on theme or direct color definition
    const color =
      itemConfig.theme?.[theme as keyof typeof itemConfig.theme] ||
      itemConfig.color;
    // Generate CSS variable (--color-KEY: VALUE)
    return color ? `  --color-${key}: ${color};` : null;
  })
  .join("\n")}
}
`
          )
          .join("\n"),
      }}
    />
  );
};

// --- Chart Tooltip Components ---
// Expose the base recharts Tooltip component
const ChartTooltip = RechartsPrimitive.Tooltip;

// Custom Tooltip Content component with enhanced styling and configuration
const ChartTooltipContent = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<typeof RechartsPrimitive.Tooltip> & // Inherit Tooltip props
    React.ComponentProps<"div"> & { // Allow standard div props
      hideLabel?: boolean;
      hideIndicator?: boolean;
      indicator?: "line" | "dot" | "dashed";
      nameKey?: string;
      labelKey?: string;
    }
>(
  (
    {
      active,
      payload,
      className,
      indicator = "dot",
      hideLabel = false,
      hideIndicator = false,
      label,
      labelFormatter,
      labelClassName,
      formatter,
      color, // Allow overriding color
      nameKey,
      labelKey,
    },
    ref
  ) => {
    const { config } = useChart(); // Get config from context

    // Memoize tooltip label calculation
    const tooltipLabel = React.useMemo(() => {
      if (hideLabel || !payload?.length) {
        return null;
      }

      const [item] = payload;
      const key = `${labelKey || item.dataKey || item.name || "value"}`;
      const itemConfig = getPayloadConfigFromPayload(config, item, key);
      // Determine label value based on props and config
      const value =
        !labelKey && typeof label === "string"
          ? config[label as keyof typeof config]?.label || label
          : itemConfig?.label;

      // Use labelFormatter if provided
      if (labelFormatter) {
        return (
          <div className={cn("font-medium", labelClassName)}>
            {labelFormatter(value, payload)}
          </div>
        );
      }

      if (!value) {
        return null;
      }
      // Default label rendering
      return <div className={cn("font-medium", labelClassName)}>{value}</div>;
    }, [ label, labelFormatter, payload, hideLabel, labelClassName, config, labelKey ]);

    // Don't render if tooltip is not active or has no data
    if (!active || !payload?.length) {
      return null;
    }

    const nestLabel = payload.length === 1 && indicator !== "dot";

    return (
      <div
        ref={ref}
        className={cn(
          "grid min-w-[8rem] items-start gap-1.5 rounded-lg border border-border/50 bg-background px-2.5 py-1.5 text-xs shadow-xl",
          className
        )}
      >
        {!nestLabel ? tooltipLabel : null} {/* Render label outside loop if needed */}
        <div className="grid gap-1.5">
          {payload.map((item, index) => {
            const key = `${nameKey || item.name || item.dataKey || "value"}`;
            const itemConfig = getPayloadConfigFromPayload(config, item, key);
            // Determine indicator color from override, payload, or item color
            const indicatorColor = color || item.payload.fill || item.color;

            return (
              <div
                key={item.dataKey}
                className={cn(
                  "flex w-full flex-wrap items-stretch gap-2 [&>svg]:h-2.5 [&>svg]:w-2.5 [&>svg]:text-muted-foreground",
                  indicator === "dot" && "items-center"
                )}
              >
                {/* Allow custom formatter */}
                {formatter && item?.value !== undefined && item.name ? (
                  formatter(item.value, item.name, item, index, item.payload)
                ) : (
                  // Default item rendering
                  <>
                    {/* Render icon from config or default indicator */}
                    {itemConfig?.icon ? (
                      <itemConfig.icon />
                    ) : (
                      !hideIndicator && (
                        <div
                          className={cn(
                            "shrink-0 rounded-[2px] border-[--color-border] bg-[--color-bg]",
                            {
                              "h-2.5 w-2.5": indicator === "dot",
                              "w-1": indicator === "line",
                              "my-0.5 w-0 border-[1.5px] border-dashed bg-transparent": indicator === "dashed",
                            }
                          )}
                          style={
                            {
                              "--color-bg": indicatorColor,
                              "--color-border": indicatorColor,
                            } as React.CSSProperties
                          }
                        />
                      )
                    )}
                    <div
                      className={cn(
                        "flex flex-1 justify-between leading-none",
                        nestLabel ? "items-end" : "items-center"
                      )}
                    >
                      <div className="grid gap-1.5">
                        {nestLabel ? tooltipLabel : null} {/* Render nested label */}
                        <span className="text-muted-foreground">
                          {itemConfig?.label || item.name} {/* Use label from config or item name */}
                        </span>
                      </div>
                      {/* Format value */}
                      {item.value && (
                        <span className="font-mono font-medium tabular-nums text-foreground">
                          {item.value.toLocaleString()}
                        </span>
                      )}
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  }
);
ChartTooltipContent.displayName = "ChartTooltipContent";

// --- Chart Legend Components ---
// Expose base recharts Legend
const ChartLegend = RechartsPrimitive.Legend;

// Custom Legend Content component
const ChartLegendContent = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div"> &
    Pick<RechartsPrimitive.LegendProps, "payload" | "verticalAlign"> & { // Pick relevant props from LegendProps
      hideIcon?: boolean;
      nameKey?: string;
    }
>(
  (
    { className, hideIcon = false, payload, verticalAlign = "bottom", nameKey },
    ref
  ) => {
    const { config } = useChart(); // Get config from context

    if (!payload?.length) {
      return null; // Don't render if no legend items
    }

    return (
      <div
        ref={ref}
        className={cn(
          "flex items-center justify-center gap-4", // Layout
          verticalAlign === "top" ? "pb-3" : "pt-3", // Adjust padding based on position
          className
        )}
      >
        {payload.map((item) => {
          const key = `${nameKey || item.dataKey || "value"}`;
          const itemConfig = getPayloadConfigFromPayload(config, item, key);

          return (
            <div
              key={item.value} // Use item value as key
              className={cn(
                "flex items-center gap-1.5 [&>svg]:h-3 [&>svg]:w-3 [&>svg]:text-muted-foreground"
              )}
            >
              {/* Render icon from config or default color swatch */}
              {itemConfig?.icon && !hideIcon ? (
                <itemConfig.icon />
              ) : (
                <div
                  className="h-2 w-2 shrink-0 rounded-[2px]"
                  style={{
                    backgroundColor: item.color, // Use color provided by recharts payload
                  }}
                />
              )}
              {/* Render label from config */}
              <span className="text-muted-foreground">
                {itemConfig?.label}
              </span>
            </div>
          );
        })}
      </div>
    );
  }
);
ChartLegendContent.displayName = "ChartLegendContent";

// --- Helper Function ---
// Extracts the config object for a specific data item from the payload
function getPayloadConfigFromPayload(
  config: ChartConfig,
  payload: unknown, // The payload item from recharts
  key: string // The key to look for (e.g., dataKey, name)
): ChartConfig[string] | undefined { // Return type is one entry from ChartConfig or undefined
  if (typeof payload !== "object" || payload === null) {
    return undefined;
  }

  // Recharts payload structure can be nested, check 'payload.payload'
  const payloadPayload =
    "payload" in payload &&
    typeof payload.payload === "object" &&
    payload.payload !== null
      ? payload.payload
      : undefined;

  let configLabelKey: string = key; // Start with the direct key

  // Allow fetching config using a string value from the payload itself
  // E.g., if payload is { name: "revenue", value: 100 }, and key is "name", configLabelKey becomes "revenue"
  if (
    key in payload &&
    typeof payload[key as keyof typeof payload] === "string"
  ) {
    configLabelKey = payload[key as keyof typeof payload] as string;
  } else if (
    payloadPayload &&
    key in payloadPayload &&
    typeof payloadPayload[key as keyof typeof payloadPayload] === "string"
  ) {
    configLabelKey = payloadPayload[
      key as keyof typeof payloadPayload
    ] as string;
  }

  // Return the config entry if found, otherwise fallback to the original key's config
  return configLabelKey in config
    ? config[configLabelKey]
    : config[key as keyof typeof config];
}

// Export all components
export {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  ChartStyle,
};