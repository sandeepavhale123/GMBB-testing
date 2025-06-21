
"use client";

import { useState } from "react";
import { AnimatedRadialChart } from "@/components/ui/animated-radial-chart";

export default function Demo() {
  const [value, setValue] = useState(74);
  const [size, setSize] = useState(300);
  const [strokeWidth, setStrokeWidth] = useState<number | undefined>(undefined);
  const [showLabels, setShowLabels] = useState(true);
  const [duration, setDuration] = useState(2);

  return (
    <div className="min-h-screen bg-black p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Controls */}
        <div className="bg-zinc-900 p-6 rounded-lg">
          <h2 className="text-xl font-bold text-white mb-4">Controls</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Value Control */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">
                Value: {value}%
              </label>
              <input
                type="range"
                min="0"
                max="100"
                value={value}
                onChange={(e) => setValue(Number(e.target.value))}
                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
              />
            </div>

            {/* Size Control */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">
                Size: {size}px
              </label>
              <input
                type="range"
                min="100"
                max="500"
                value={size}
                onChange={(e) => setSize(Number(e.target.value))}
                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
              />
            </div>

            {/* Stroke Width Control */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">
                Stroke Width: {strokeWidth || 'Auto'}
              </label>
              <div className="flex items-center space-x-2">
                <input
                  type="range"
                  min="8"
                  max="40"
                  value={strokeWidth || size * 0.06}
                  onChange={(e) => setStrokeWidth(Number(e.target.value))}
                  className="flex-1 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                />
                <button
                  onClick={() => setStrokeWidth(undefined)}
                  className="px-2 py-1 text-xs bg-gray-700 text-gray-300 rounded hover:bg-gray-600"
                >
                  Auto
                </button>
              </div>
            </div>

            {/* Duration Control */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">
                Duration: {duration}s
              </label>
              <input
                type="range"
                min="0.5"
                max="5"
                step="0.1"
                value={duration}
                onChange={(e) => setDuration(Number(e.target.value))}
                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
              />
            </div>

            {/* Show Labels Toggle */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">
                Show Labels
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={showLabels}
                  onChange={(e) => setShowLabels(e.target.checked)}
                  className="w-4 h-4 text-orange-500 bg-gray-700 border-gray-600 rounded focus:ring-orange-500"
                />
                <span className="text-gray-400 text-sm">Enabled</span>
              </label>
            </div>

            {/* Quick Presets */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">
                Quick Presets
              </label>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setValue(25)}
                  className="px-2 py-1 text-xs bg-red-600 text-white rounded hover:bg-red-700"
                >
                  25%
                </button>
                <button
                  onClick={() => setValue(50)}
                  className="px-2 py-1 text-xs bg-yellow-600 text-white rounded hover:bg-yellow-700"
                >
                  50%
                </button>
                <button
                  onClick={() => setValue(75)}
                  className="px-2 py-1 text-xs bg-orange-600 text-white rounded hover:bg-orange-700"
                >
                  75%
                </button>
                <button
                  onClick={() => setValue(100)}
                  className="px-2 py-1 text-xs bg-green-600 text-white rounded hover:bg-green-700"
                >
                  100%
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Chart Display */}
        <div className="flex items-center justify-center">
          <AnimatedRadialChart
            value={value}
            size={size}
            strokeWidth={strokeWidth}
            showLabels={showLabels}
            duration={duration}
            key={`${value}-${size}-${strokeWidth}-${showLabels}-${duration}`} // Force re-render on changes
          />
        </div>

        {/* Different Sizes Demo */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-white">Size Variations</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 items-center justify-items-center">
            <div className="text-center">
              <p className="text-gray-400 text-sm mb-2">Small (150px)</p>
              <AnimatedRadialChart value={45} size={150} />
            </div>
            <div className="text-center">
              <p className="text-gray-400 text-sm mb-2">Medium (200px)</p>
              <AnimatedRadialChart value={65} size={200} />
            </div>
            <div className="text-center">
              <p className="text-gray-400 text-sm mb-2">Large (250px)</p>
              <AnimatedRadialChart value={85} size={250} />
            </div>
            <div className="text-center">
              <p className="text-gray-400 text-sm mb-2">Extra Large (300px)</p>
              <AnimatedRadialChart value={95} size={300} />
            </div>
          </div>
        </div>

        {/* Props Documentation */}
        <div className="bg-zinc-900 p-6 rounded-lg">
          <h2 className="text-xl font-bold text-white mb-4">Component Props</h2>
          <div className="space-y-3 text-gray-300">
            <div><code className="text-orange-400">value</code>: <span className="text-gray-400">number (0-100) - The percentage value to display</span></div>
            <div><code className="text-orange-400">size</code>: <span className="text-gray-400">number - The width/height of the component in pixels</span></div>
            <div><code className="text-orange-400">strokeWidth</code>: <span className="text-gray-400">number | undefined - Custom stroke width (auto-calculated if not provided)</span></div>
            <div><code className="text-orange-400">className</code>: <span className="text-gray-400">string - Additional CSS classes</span></div>
            <div><code className="text-orange-400">showLabels</code>: <span className="text-gray-400">boolean - Show/hide 0% and 100% labels</span></div>
            <div><code className="text-orange-400">duration</code>: <span className="text-gray-400">number - Animation duration in seconds</span></div>
          </div>
        </div>
      </div>
    </div>
  );
}
