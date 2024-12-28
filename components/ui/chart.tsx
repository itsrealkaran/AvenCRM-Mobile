import React, { createContext, useContext, useMemo } from "react"
import { View, Text, StyleSheet, ViewStyle } from "react-native"
import { Svg, Rect } from "react-native-svg"

interface ChartConfig {
  [key: string]: {
    label: string
    color: string
  }
}

interface ChartContextValue {
  config: ChartConfig
}

const ChartContext = createContext<ChartContextValue | undefined>(undefined)

interface ChartContainerProps {
  config: ChartConfig
  children: React.ReactNode
  style?: ViewStyle
}

export function ChartContainer({ config, children, style }: ChartContainerProps) {
  const value = useMemo(() => ({ config }), [config])

  return (
    <ChartContext.Provider value={value}>
      <View style={[styles.container, style]}>
        {children}
      </View>
    </ChartContext.Provider>
  )
}

interface ChartTooltipProps {
  x: number
  y: number
  width: number
  height: number
  payload?: TooltipPayload[]
}

export function ChartTooltip({ x, y, width, height, payload }: ChartTooltipProps) {
  const context = useContext(ChartContext)

  if (!context || !payload || payload.length === 0) {
    return null
  }

  const { config } = context

  return (
    <View style={[styles.tooltipContainer, { left: x, top: y }]}>
      {payload.map(({ name, value }) => (
        <View key={name} style={styles.tooltipItem}>
          <View style={[styles.tooltipColor, { backgroundColor: config[name]?.color }]} />
          <Text style={styles.tooltipLabel}>{config[name]?.label || name}</Text>
          <Text style={styles.tooltipValue}>{value}</Text>
        </View>
      ))}
    </View>
  )
}

interface TooltipPayload {
  name: string
  value: number
  payload: {
    [key: string]: any
  }
}

export function Bar({ x, y, width, height, fill }: { x: number, y: number, width: number, height: number, fill: string }) {
  return (
    <Rect x={x} y={y} width={width} height={height} fill={fill} />
  )
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
  },
  tooltipContainer: {
    position: 'absolute',
    backgroundColor: 'white',
    padding: 8,
    borderRadius: 4,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  tooltipItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  tooltipColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  tooltipLabel: {
    marginRight: 8,
    fontSize: 12,
    color: '#666',
  },
  tooltipValue: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#333',
  },
})

