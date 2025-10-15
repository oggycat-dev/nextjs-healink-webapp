"use client";

import { useEffect, useState } from "react";
import { getEnvConfig, validateEnvConfig, checkApiHealth } from "@/lib/env-helper";

/**
 * Development Environment Status Component
 * Only visible in development mode with debug enabled
 */
export default function EnvStatus() {
  const [isOpen, setIsOpen] = useState(false);
  const [apiHealthy, setApiHealthy] = useState<boolean | null>(null);
  const [config, setConfig] = useState<any>(null);
  const [validation, setValidation] = useState<any>(null);

  useEffect(() => {
    // Only show in development
    if (process.env.NODE_ENV !== 'development') return;

    setConfig(getEnvConfig());
    setValidation(validateEnvConfig());

    // Check API health
    checkApiHealth().then(setApiHealthy);
  }, []);

  // Don't render in production
  if (process.env.NODE_ENV !== 'development') return null;
  if (!config) return null;

  return (
    <>
      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-4 right-4 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-[#604B3B] text-white shadow-lg hover:bg-[#4a3a2d] transition-colors"
        title="Environment Status"
      >
        <span className="text-xl">⚙️</span>
      </button>

      {/* Status Panel */}
      {isOpen && (
        <div className="fixed bottom-20 right-4 z-50 w-96 max-h-[600px] overflow-auto rounded-xl bg-white shadow-2xl border-2 border-[#604B3B]">
          {/* Header */}
          <div className="sticky top-0 bg-[#604B3B] px-4 py-3 text-white flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xl">🔧</span>
              <span className="font-bold">Environment Status</span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="hover:bg-white/20 rounded px-2 py-1"
            >
              ✕
            </button>
          </div>

          {/* Content */}
          <div className="p-4 space-y-4 text-sm">
            {/* API Health */}
            <div className="rounded-lg border border-gray-200 p-3">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-lg">
                  {apiHealthy === null ? "⏳" : apiHealthy ? "✅" : "❌"}
                </span>
                <span className="font-semibold text-[#604B3B]">API Status</span>
              </div>
              <div className="text-xs text-gray-600 break-all">
                {config.api.gateway}
              </div>
              <div className="mt-1 text-xs">
                {apiHealthy === null && (
                  <span className="text-yellow-600">Checking...</span>
                )}
                {apiHealthy === true && (
                  <span className="text-green-600">Connected</span>
                )}
                {apiHealthy === false && (
                  <span className="text-red-600">Not reachable</span>
                )}
              </div>
            </div>

            {/* Validation */}
            <div className="rounded-lg border border-gray-200 p-3">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-lg">
                  {validation.valid ? "✅" : "⚠️"}
                </span>
                <span className="font-semibold text-[#604B3B]">Validation</span>
              </div>
              {validation.valid ? (
                <div className="text-xs text-green-600">
                  All environment variables configured correctly
                </div>
              ) : (
                <ul className="text-xs text-red-600 space-y-1">
                  {validation.errors.map((error: string, i: number) => (
                    <li key={i}>• {error}</li>
                  ))}
                </ul>
              )}
            </div>

            {/* Environment */}
            <div className="rounded-lg border border-gray-200 p-3">
              <div className="font-semibold text-[#604B3B] mb-2">Environment</div>
              <div className="space-y-1 text-xs">
                <div className="flex justify-between">
                  <span className="text-gray-600">Mode:</span>
                  <span className="font-mono">
                    {config.environment.isDevelopment && "development"}
                    {config.environment.isProduction && "production"}
                    {config.environment.isTest && "test"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Debug:</span>
                  <span className="font-mono">
                    {config.apiConfig.enableDebug ? "ON" : "OFF"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Log Level:</span>
                  <span className="font-mono">{config.apiConfig.logLevel}</span>
                </div>
              </div>
            </div>

            {/* Services */}
            <div className="rounded-lg border border-gray-200 p-3">
              <div className="font-semibold text-[#604B3B] mb-2">Services</div>
              <div className="space-y-2 text-xs">
                {Object.entries(config.api).map(([key, url]) => (
                  <div key={key} className="space-y-1">
                    <div className="font-medium text-gray-700 capitalize">{key}</div>
                    <div className="font-mono text-gray-600 break-all">{url as string}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* App Config */}
            <div className="rounded-lg border border-gray-200 p-3">
              <div className="font-semibold text-[#604B3B] mb-2">App Config</div>
              <div className="space-y-1 text-xs">
                <div className="flex justify-between">
                  <span className="text-gray-600">Name:</span>
                  <span className="font-mono">{config.app.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">URL:</span>
                  <span className="font-mono text-xs break-all">{config.app.url}</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              <button
                onClick={() => {
                  checkApiHealth().then(setApiHealthy);
                }}
                className="flex-1 rounded-lg bg-[#604B3B] px-3 py-2 text-xs font-medium text-white hover:bg-[#4a3a2d]"
              >
                Refresh Status
              </button>
              <button
                onClick={() => {
                  console.log("Environment Config:", getEnvConfig());
                  console.log("Validation:", validateEnvConfig());
                }}
                className="flex-1 rounded-lg border border-[#604B3B] px-3 py-2 text-xs font-medium text-[#604B3B] hover:bg-[#FBE7BA]/30"
              >
                Log to Console
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
