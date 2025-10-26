"use client"

import { CartesianGrid, Line, LineChart, Tooltip, XAxis, YAxis, Legend, ReferenceLine, Bar, ComposedChart } from "recharts"
import { useState, useMemo } from "react"

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import {
    ChartConfig,
    ChartContainer,
} from "@/components/ui/chart"
import { Slider } from "@/components/ui/slider"
import { MonthlySalesF } from "@/app/types"

const chartConfig = {
    Dessert: {
        label: "Dessert",
        color: "#8b5cf6",
    },
    Red: {
        label: "Red",
        color: "#dc2626",
    },
    Rosé: {
        label: "Rosé",
        color: "#ec4899",
    },
    Sparkling: {
        label: "Sparkling",
        color: "#fbbf24",
    },
    White: {
        label: "White",
        color: "#22c55e",
    },
} satisfies ChartConfig;

interface SalesPriceStatsCatProps {
    chartData: MonthlySalesF[]
}

export const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const SalesPriceStatsOnCat = ({ chartData }: SalesPriceStatsCatProps) => {
    const [rangeValues, setRangeValues] = useState<number[]>([0, 0]);
    const [selectedCategories, setSelectedCategories] = useState<string[]>(Object.keys(chartConfig));

    const toggleCategory = (category: string) => {
        setSelectedCategories(prev =>
            prev.includes(category)
                ? prev.filter(c => c !== category)
                : [...prev, category]
        );
    };
    // Process and format data
    const allFormattedData = useMemo(() => {
        // Group by year-month
        const grouped = chartData.reduce((acc, item) => {
            const key = `${item.year}-${item.month}`;
            if (!acc[key]) {
                acc[key] = {
                    year: item.year,
                    month: item.month,
                    yearMonth: `${monthNames[item.month - 1]} ${item.year}`,
                    categories: {}
                };
            }
            acc[key].categories[item.category] = {
                priceChangePercent: 0,
                salesChangePercent: 0,
                avgPrice: item.avgPrice,
                totalAmount: item.totalAmount
            };
            return acc;
        }, {} as any);

        // Sort by date
        const sorted = Object.values(grouped).sort((a: any, b: any) =>
            (a.year - b.year) || (a.month - b.month)
        );

        // Remove first and last month
        if (sorted.length > 2) {
            sorted.shift();
            sorted.pop();
        }

        // Calculate percentage changes for each category
        const withChanges = sorted.map((item: any, index: number) => {
            if (index === 0) return item;

            const prev: any = sorted[index - 1];
            const categories = { ...item.categories };

            Object.keys(categories).forEach(cat => {
                if (prev.categories[cat]) {
                    const priceChange = ((categories[cat].avgPrice - prev.categories[cat].avgPrice) / prev.categories[cat].avgPrice) * 100;
                    const salesChange = ((categories[cat].totalAmount - prev.categories[cat].totalAmount) / prev.categories[cat].totalAmount) * 100;

                    categories[cat] = {
                        ...categories[cat],
                        priceChangePercent: priceChange,
                        salesChangePercent: salesChange
                    };
                }
            });

            return { ...item, categories };
        });

        // Flatten for chart
        return withChanges.map((item: any) => {
            const flattened: any = {
                yearMonth: item.yearMonth,
                year: item.year,
                month: item.month
            };

            Object.keys(item.categories).forEach(cat => {
                flattened[`${cat}_price`] = item.categories[cat].priceChangePercent;
                flattened[`${cat}_sales`] = item.categories[cat].salesChangePercent;
                flattened[`${cat}_avgPrice`] = item.categories[cat].avgPrice;
                flattened[`${cat}_totalAmount`] = item.categories[cat].totalAmount;
            });

            return flattened;
        });
    }, [chartData]);

    // Initialize range after data is ready
    useMemo(() => {
        if (allFormattedData.length > 0 && rangeValues[1] === 0) {
            setRangeValues([0, Math.max(0, allFormattedData.length - 1)]);
        }
    }, [allFormattedData]);

    const displayedData = useMemo(() => {
        return allFormattedData.slice(rangeValues[0], rangeValues[1] + 1);
    }, [allFormattedData, rangeValues]);

    const getDateRange = () => {
        if (displayedData.length === 0) return "";
        const first = displayedData[0];
        const last = displayedData[displayedData.length - 1];
        return `${monthNames[first.month - 1]} ${first.year} - ${monthNames[last.month - 1]} ${last.year}`;
    };

    const handleSliderChange = (values: number[]) => {
        setRangeValues(values);
    };

    // Calculate insights for selected categories
    const insights = useMemo(() => {
        if (displayedData.length < 2) return [];

        const results = selectedCategories.map(cat => {
            let inverseCases = 0;
            let totalCases = 0;
            let avgPriceChange = 0;
            let avgSalesChange = 0;
            let maxPriceIncrease = -Infinity;
            let maxPriceDecrease = Infinity;

            displayedData.slice(1).forEach(item => {
                const priceChange = item[`${cat}_price`];
                const salesChange = item[`${cat}_sales`];

                if (priceChange !== undefined && Math.abs(priceChange) > 0.5) {
                    totalCases++;
                    avgPriceChange += priceChange;
                    avgSalesChange += salesChange;

                    if (priceChange > maxPriceIncrease) maxPriceIncrease = priceChange;
                    if (priceChange < maxPriceDecrease) maxPriceDecrease = priceChange;

                    if ((priceChange < 0 && salesChange > 0) || (priceChange > 0 && salesChange < 0)) {
                        inverseCases++;
                    }
                }
            });

            if (totalCases === 0) return null;

            const inversePercent = (inverseCases / totalCases * 100).toFixed(0);
            avgPriceChange = avgPriceChange / totalCases;
            avgSalesChange = avgSalesChange / totalCases;

            return {
                category: cat,
                color: chartConfig[cat as keyof typeof chartConfig].color,
                inverseCorrelation: parseInt(inversePercent),
                avgPriceChange,
                avgSalesChange,
                maxPriceIncrease: maxPriceIncrease === -Infinity ? 0 : maxPriceIncrease,
                maxPriceDecrease: maxPriceDecrease === Infinity ? 0 : maxPriceDecrease,
                priceElasticity: avgPriceChange !== 0 ? (avgSalesChange / avgPriceChange).toFixed(2) : 'N/A'
            };
        }).filter(Boolean);

        return results;
    }, [displayedData, selectedCategories]);

    return (
        <div className="space-y-6">
            {/* Category Selection */}
            <Card>
                <CardHeader>
                    <CardTitle>Select Categories</CardTitle>
                    <CardDescription>Choose one or more wine categories to analyze</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-wrap gap-4">
                        {Object.keys(chartConfig).map(cat => (
                            <div key={cat} className="flex items-center space-x-2">
                                <Checkbox
                                    id={cat}
                                    checked={selectedCategories.includes(cat)}
                                    onCheckedChange={() => toggleCategory(cat)}
                                />
                                <Label
                                    htmlFor={cat}
                                    className="flex items-center gap-2 cursor-pointer"
                                >
                                    <div
                                        className="w-4 h-4 rounded"
                                        style={{ backgroundColor: chartConfig[cat as keyof typeof chartConfig].color }}
                                    />
                                    {cat}
                                </Label>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle>Price Changes by Category</CardTitle>
                    <CardDescription>{getDateRange()}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <div className="flex justify-between text-xs text-muted-foreground">
                            <span>{allFormattedData[rangeValues[0]]?.yearMonth || ''}</span>
                            <span>{allFormattedData[rangeValues[1]]?.yearMonth || ''}</span>
                        </div>
                        <Slider
                            min={0}
                            max={Math.max(0, allFormattedData.length - 1)}
                            step={1}
                            value={rangeValues}
                            onValueChange={handleSliderChange}
                            className="w-full"
                        />
                    </div>

                    <ChartContainer config={chartConfig}>
                        <ComposedChart data={displayedData} margin={{ left: 12, right: 12, top: 20 }}>
                            <CartesianGrid vertical={false} strokeDasharray="3 3" />
                            <XAxis
                                dataKey="yearMonth"
                                tickLine={false}
                                axisLine={false}
                                tickMargin={8}
                                angle={-45}
                                textAnchor="end"
                                height={80}
                            />
                            <YAxis
                                tickFormatter={(value) => `${value > 0 ? '+' : ''}${value.toFixed(0)}%`}
                                label={{ value: 'Price Change %', angle: -90, position: 'insideLeft' }}
                            />
                            <ReferenceLine y={0} stroke="#666" strokeDasharray="3 3" />

                            <Tooltip
                                content={({ active, payload }) => {
                                    if (!active || !payload?.length) return null;
                                    const data = payload[0].payload;
                                    return (
                                        <div className="bg-neutral-200 z-10 text-black border rounded-lg shadow-lg p-3 max-w-xs">
                                            <p className="font-medium mb-2">{data.yearMonth}</p>
                                            {selectedCategories.map(cat => {
                                                const priceKey = `${cat}_price`;
                                                const avgPriceKey = `${cat}_avgPrice`;
                                                if (data[priceKey] !== undefined) {
                                                    return (
                                                        <p key={cat} className="text-xs" style={{ color: chartConfig[cat as keyof typeof chartConfig].color }}>
                                                            {cat}: {data[priceKey] > 0 ? '+' : ''}{data[priceKey].toFixed(1)}%
                                                            <span className="text-muted-foreground ml-1">(${data[avgPriceKey]?.toFixed(2)})</span>
                                                        </p>
                                                    );
                                                }
                                                return null;
                                            })}
                                        </div>
                                    );
                                }}
                            />
                            <Legend />

                            {selectedCategories.map(cat => (
                                <Bar
                                    key={cat}
                                    name={`${cat}`}
                                    dataKey={`${cat}_price`}
                                    fill={chartConfig[cat as keyof typeof chartConfig].color}
                                    opacity={0.7}
                                    radius={[4, 4, 0, 0]}
                                />
                            ))}
                        </ComposedChart>
                    </ChartContainer>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Sales Evolution by Category</CardTitle>
                    <CardDescription>{getDateRange()}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <div className="flex justify-between text-xs text-muted-foreground">
                            <span>{allFormattedData[rangeValues[0]]?.yearMonth || ''}</span>
                            <span>{allFormattedData[rangeValues[1]]?.yearMonth || ''}</span>
                        </div>
                        <Slider
                            min={0}
                            max={Math.max(0, allFormattedData.length - 1)}
                            step={1}
                            value={rangeValues}
                            onValueChange={handleSliderChange}
                            className="w-full"
                        />
                    </div>

                    <ChartContainer config={chartConfig}>
                        <LineChart data={displayedData} margin={{ left: 12, right: 12, top: 20 }}>
                            <CartesianGrid vertical={false} strokeDasharray="3 3" />
                            <XAxis
                                dataKey="yearMonth"
                                tickLine={false}
                                axisLine={false}
                                tickMargin={8}
                                angle={-45}
                                textAnchor="end"
                                height={80}
                            />
                            <YAxis
                                tickFormatter={(value) => `${value > 0 ? '+' : ''}${value.toFixed(0)}%`}
                                label={{ value: 'Sales Change %', angle: -90, position: 'insideLeft' }}
                            />
                            <ReferenceLine y={0} stroke="#666" strokeDasharray="3 3" />

                            <Tooltip
                                content={({ active, payload }) => {
                                    if (!active || !payload?.length) return null;
                                    const data = payload[0].payload;
                                    return (
                                        <div className="bg-neutral-200 text-black z-10 border rounded-lg shadow-lg p-3 max-w-xs">
                                            <p className="font-medium mb-2">{data.yearMonth}</p>
                                            {selectedCategories.map(cat => {
                                                const salesKey = `${cat}_sales`;
                                                const totalKey = `${cat}_totalAmount`;
                                                if (data[salesKey] !== undefined) {
                                                    return (
                                                        <p key={cat} className="text-xs" style={{ color: chartConfig[cat as keyof typeof chartConfig].color }}>
                                                            {cat}: {data[salesKey] > 0 ? '+' : ''}{data[salesKey].toFixed(1)}%
                                                            <span className="text-muted-foreground ml-1">(${data[totalKey]?.toLocaleString()})</span>
                                                        </p>
                                                    );
                                                }
                                                return null;
                                            })}
                                        </div>
                                    );
                                }}
                            />
                            <Legend />

                            {selectedCategories.map(cat => (
                                <Line
                                    key={cat}
                                    name={`${cat}`}
                                    dataKey={`${cat}_sales`}
                                    type="monotone"
                                    stroke={chartConfig[cat as keyof typeof chartConfig].color}
                                    strokeWidth={2.5}
                                    dot={{ r: 3 }}
                                />
                            ))}
                        </LineChart>
                    </ChartContainer>
                </CardContent>
                <CardFooter className="flex-col items-start gap-4 text-sm border-t pt-4">
                    <div className="font-semibold text-base">Analysis Results</div>
                    {insights.length === 0 ? (
                        <p className="text-muted-foreground">Select at least one category to see analysis</p>
                    ) : (
                        <div className="w-full space-y-3">
                            {insights.map((insight: any) => (
                                <div key={insight.category} className="border rounded-lg p-3 space-y-2">
                                    <div className="flex items-center gap-2 font-medium">
                                        <div
                                            className="w-3 h-3 rounded"
                                            style={{ backgroundColor: insight.color }}
                                        />
                                        {insight.category}
                                    </div>
                                    <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                                        <div>
                                            <span className="font-medium">Inverse Correlation:</span> {insight.inverseCorrelation}%
                                        </div>
                                        <div>
                                            <span className="font-medium">Avg Price Change:</span> {insight.avgPriceChange > 0 ? '+' : ''}{insight.avgPriceChange.toFixed(1)}%
                                        </div>
                                        <div>
                                            <span className="font-medium">Avg Sales Change:</span> {insight.avgSalesChange > 0 ? '+' : ''}{insight.avgSalesChange.toFixed(1)}%
                                        </div>
                                        <div>
                                            <span className="font-medium">Price Elasticity:</span> {insight.priceElasticity}
                                        </div>
                                    </div>
                                    <div className="text-xs">
                                        {insight.inverseCorrelation > 60 ? (
                                            <span className="text-green-600">✓ Strong inverse correlation - price cuts drive sales</span>
                                        ) : insight.inverseCorrelation > 40 ? (
                                            <span className="text-yellow-600">⚠ Moderate correlation - mixed results</span>
                                        ) : (
                                            <span className="text-blue-600">→ Weak inverse correlation - other factors may dominate</span>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </CardFooter>
            </Card>
        </div>
    )
}

export default SalesPriceStatsOnCat