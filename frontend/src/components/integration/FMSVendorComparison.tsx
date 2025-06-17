'use client';

import React, { useState, useCallback } from 'react';
import { 
  BarChart3, 
  CheckCircle, 
  X, 
  Star, 
  DollarSign, 
  Clock, 
  Shield, 
  Zap, 
  Users, 
  Globe,
  Settings,
  Award,
  TrendingUp,
  Filter,
  Download,
  Eye
} from 'lucide-react';

interface FMSVendor {
  id: string;
  name: string;
  logo: string;
  marketShare: number;
  established: number;
  headquarters: string;
  globalPresence: number; // number of countries
  features: {
    realTimeTracking: boolean;
    routeOptimization: boolean;
    fuelMonitoring: boolean;
    maintenanceAlerts: boolean;
    weatherIntegration: boolean;
    aiOptimization: boolean;
    mobileApp: boolean;
    cloudDeployment: boolean;
    onPremiseOption: boolean;
    apiAccess: boolean;
    customDashboards: boolean;
    predictiveAnalytics: boolean;
  };
  technicalSpecs: {
    maxEquipment: number;
    dataRetention: string;
    updateFrequency: string;
    apiCallsPerDay: number;
    uptime: number; // percentage
    latency: number; // milliseconds
    supportedProtocols: string[];
    integrationComplexity: 'Low' | 'Medium' | 'High';
  };
  pricing: {
    model: 'Per Equipment' | 'Site License' | 'Usage Based' | 'Custom';
    startingPrice: number;
    currency: string;
    setupFee: number;
    monthlyMinimum: number;
  };
  support: {
    availability: string;
    responseTime: string;
    trainingIncluded: boolean;
    onSiteSupport: boolean;
    documentation: 'Excellent' | 'Good' | 'Fair' | 'Poor';
    userRating: number; // out of 5
  };
  compliance: {
    iso9001: boolean;
    iso14001: boolean;
    iso45001: boolean;
    msha: boolean;
    eucompliance: boolean;
    gdpr: boolean;
    soc2: boolean;
  };
  marketMetrics: {
    customerSatisfaction: number; // out of 5
    implementationTime: number; // days
    roiTimeframe: number; // months
    marketGrowth: number; // percentage
  };
}

const fmsVendors: FMSVendor[] = [
  {
    id: 'komatsu',
    name: 'Komatsu KOMTRAX',
    logo: '🏗️',
    marketShare: 28.5,
    established: 1999,
    headquarters: 'Tokyo, Japan',
    globalPresence: 45,
    features: {
      realTimeTracking: true,
      routeOptimization: true,
      fuelMonitoring: true,
      maintenanceAlerts: true,
      weatherIntegration: true,
      aiOptimization: true,
      mobileApp: true,
      cloudDeployment: true,
      onPremiseOption: true,
      apiAccess: true,
      customDashboards: true,
      predictiveAnalytics: true,
    },
    technicalSpecs: {
      maxEquipment: 5000,
      dataRetention: '10 years',
      updateFrequency: '30 seconds',
      apiCallsPerDay: 1000000,
      uptime: 99.9,
      latency: 45,
      supportedProtocols: ['OPC UA', 'REST', 'MQTT', 'WebSocket'],
      integrationComplexity: 'Medium',
    },
    pricing: {
      model: 'Per Equipment',
      startingPrice: 125,
      currency: 'USD',
      setupFee: 15000,
      monthlyMinimum: 2500,
    },
    support: {
      availability: '24/7',
      responseTime: '< 2 hours',
      trainingIncluded: true,
      onSiteSupport: true,
      documentation: 'Excellent',
      userRating: 4.6,
    },
    compliance: {
      iso9001: true,
      iso14001: true,
      iso45001: true,
      msha: true,
      eucompliance: true,
      gdpr: true,
      soc2: true,
    },
    marketMetrics: {
      customerSatisfaction: 4.5,
      implementationTime: 45,
      roiTimeframe: 8,
      marketGrowth: 12.3,
    },
  },
  {
    id: 'caterpillar',
    name: 'Caterpillar MineStar',
    logo: '🚛',
    marketShare: 31.2,
    established: 1996,
    headquarters: 'Peoria, USA',
    globalPresence: 38,
    features: {
      realTimeTracking: true,
      routeOptimization: true,
      fuelMonitoring: true,
      maintenanceAlerts: true,
      weatherIntegration: false,
      aiOptimization: true,
      mobileApp: true,
      cloudDeployment: true,
      onPremiseOption: true,
      apiAccess: true,
      customDashboards: true,
      predictiveAnalytics: true,
    },
    technicalSpecs: {
      maxEquipment: 10000,
      dataRetention: '7 years',
      updateFrequency: '15 seconds',
      apiCallsPerDay: 2000000,
      uptime: 99.95,
      latency: 38,
      supportedProtocols: ['OPC UA', 'REST', 'GraphQL', 'WebSocket'],
      integrationComplexity: 'High',
    },
    pricing: {
      model: 'Site License',
      startingPrice: 5000,
      currency: 'USD',
      setupFee: 25000,
      monthlyMinimum: 8000,
    },
    support: {
      availability: '24/7',
      responseTime: '< 1 hour',
      trainingIncluded: true,
      onSiteSupport: true,
      documentation: 'Excellent',
      userRating: 4.8,
    },
    compliance: {
      iso9001: true,
      iso14001: true,
      iso45001: true,
      msha: true,
      eucompliance: true,
      gdpr: true,
      soc2: true,
    },
    marketMetrics: {
      customerSatisfaction: 4.7,
      implementationTime: 65,
      roiTimeframe: 6,
      marketGrowth: 8.7,
    },
  },
  {
    id: 'wenco',
    name: 'Wenco FMS',
    logo: '⛏️',
    marketShare: 18.7,
    established: 1993,
    headquarters: 'Richmond, Canada',
    globalPresence: 25,
    features: {
      realTimeTracking: true,
      routeOptimization: true,
      fuelMonitoring: false,
      maintenanceAlerts: true,
      weatherIntegration: false,
      aiOptimization: false,
      mobileApp: true,
      cloudDeployment: false,
      onPremiseOption: true,
      apiAccess: true,
      customDashboards: false,
      predictiveAnalytics: false,
    },
    technicalSpecs: {
      maxEquipment: 2500,
      dataRetention: '5 years',
      updateFrequency: '60 seconds',
      apiCallsPerDay: 500000,
      uptime: 99.5,
      latency: 72,
      supportedProtocols: ['OPC UA', 'REST', 'TCP/IP'],
      integrationComplexity: 'Low',
    },
    pricing: {
      model: 'Per Equipment',
      startingPrice: 95,
      currency: 'USD',
      setupFee: 8000,
      monthlyMinimum: 1500,
    },
    support: {
      availability: 'Business Hours',
      responseTime: '< 4 hours',
      trainingIncluded: false,
      onSiteSupport: false,
      documentation: 'Good',
      userRating: 4.1,
    },
    compliance: {
      iso9001: true,
      iso14001: false,
      iso45001: true,
      msha: true,
      eucompliance: false,
      gdpr: false,
      soc2: false,
    },
    marketMetrics: {
      customerSatisfaction: 4.0,
      implementationTime: 30,
      roiTimeframe: 12,
      marketGrowth: 5.2,
    },
  },
  {
    id: 'modular',
    name: 'Modular Mining DISPATCH',
    logo: '📡',
    marketShare: 15.1,
    established: 1979,
    headquarters: 'Tucson, USA',
    globalPresence: 32,
    features: {
      realTimeTracking: true,
      routeOptimization: true,
      fuelMonitoring: true,
      maintenanceAlerts: true,
      weatherIntegration: true,
      aiOptimization: false,
      mobileApp: false,
      cloudDeployment: false,
      onPremiseOption: true,
      apiAccess: false,
      customDashboards: true,
      predictiveAnalytics: false,
    },
    technicalSpecs: {
      maxEquipment: 3000,
      dataRetention: '3 years',
      updateFrequency: '45 seconds',
      apiCallsPerDay: 100000,
      uptime: 99.7,
      latency: 85,
      supportedProtocols: ['OPC UA', 'Proprietary'],
      integrationComplexity: 'High',
    },
    pricing: {
      model: 'Custom',
      startingPrice: 0,
      currency: 'USD',
      setupFee: 50000,
      monthlyMinimum: 12000,
    },
    support: {
      availability: '24/7',
      responseTime: '< 3 hours',
      trainingIncluded: true,
      onSiteSupport: true,
      documentation: 'Good',
      userRating: 4.3,
    },
    compliance: {
      iso9001: true,
      iso14001: true,
      iso45001: true,
      msha: true,
      eucompliance: false,
      gdpr: false,
      soc2: true,
    },
    marketMetrics: {
      customerSatisfaction: 4.2,
      implementationTime: 90,
      roiTimeframe: 10,
      marketGrowth: 3.8,
    },
  },
  {
    id: 'hexagon',
    name: 'Hexagon Mining',
    logo: '⬡',
    marketShare: 6.5,
    established: 2005,
    headquarters: 'Stockholm, Sweden',
    globalPresence: 28,
    features: {
      realTimeTracking: true,
      routeOptimization: true,
      fuelMonitoring: true,
      maintenanceAlerts: true,
      weatherIntegration: true,
      aiOptimization: true,
      mobileApp: true,
      cloudDeployment: true,
      onPremiseOption: false,
      apiAccess: true,
      customDashboards: true,
      predictiveAnalytics: true,
    },
    technicalSpecs: {
      maxEquipment: 1500,
      dataRetention: '5 years',
      updateFrequency: '20 seconds',
      apiCallsPerDay: 750000,
      uptime: 99.8,
      latency: 55,
      supportedProtocols: ['OPC UA', 'REST', 'MQTT'],
      integrationComplexity: 'Medium',
    },
    pricing: {
      model: 'Usage Based',
      startingPrice: 0.05,
      currency: 'USD',
      setupFee: 20000,
      monthlyMinimum: 3000,
    },
    support: {
      availability: 'Business Hours',
      responseTime: '< 6 hours',
      trainingIncluded: true,
      onSiteSupport: false,
      documentation: 'Fair',
      userRating: 3.9,
    },
    compliance: {
      iso9001: true,
      iso14001: true,
      iso45001: false,
      msha: false,
      eucompliance: true,
      gdpr: true,
      soc2: true,
    },
    marketMetrics: {
      customerSatisfaction: 3.8,
      implementationTime: 35,
      roiTimeframe: 14,
      marketGrowth: 15.6,
    },
  },
];

type ComparisonCategory = 'features' | 'technical' | 'pricing' | 'support' | 'compliance' | 'metrics' | 'all';

export default function FMSVendorComparison() {
  const [selectedCategory, setSelectedCategory] = useState<ComparisonCategory>('all');
  const [selectedVendors, setSelectedVendors] = useState<string[]>(fmsVendors.map(v => v.id));
  const [sortBy, setSortBy] = useState<'marketShare' | 'customerSatisfaction' | 'pricing' | 'established'>('marketShare');
  const [showFilters, setShowFilters] = useState(false);

  const toggleVendorSelection = useCallback((vendorId: string) => {
    setSelectedVendors(prev => 
      prev.includes(vendorId) 
        ? prev.filter(id => id !== vendorId)
        : [...prev, vendorId]
    );
  }, []);

  const filteredVendors = fmsVendors
    .filter(vendor => selectedVendors.includes(vendor.id))
    .sort((a, b) => {
      switch (sortBy) {
        case 'marketShare':
          return b.marketShare - a.marketShare;
        case 'customerSatisfaction':
          return b.marketMetrics.customerSatisfaction - a.marketMetrics.customerSatisfaction;
        case 'pricing':
          return a.pricing.startingPrice - b.pricing.startingPrice;
        case 'established':
          return a.established - b.established;
        default:
          return 0;
      }
    });

  const renderFeatureCell = (hasFeature: boolean) => (
    <div className="flex justify-center">
      {hasFeature ? (
        <CheckCircle className="w-5 h-5 text-green-500" />
      ) : (
        <X className="w-5 h-5 text-red-500" />
      )}
    </div>
  );

  const renderStarRating = (rating: number) => (
    <div className="flex items-center space-x-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`w-4 h-4 ${
            star <= rating ? 'text-yellow-400 fill-current' : 'text-gray-400'
          }`}
        />
      ))}
      <span className="text-sm text-gray-300 ml-2">{rating.toFixed(1)}</span>
    </div>
  );

  const exportComparison = useCallback(() => {
    const csvContent = [
      ['Vendor', 'Market Share', 'Customer Satisfaction', 'Starting Price', 'Uptime', 'Support Rating'].join(','),
      ...filteredVendors.map(vendor => [
        vendor.name,
        `${vendor.marketShare}%`,
        vendor.marketMetrics.customerSatisfaction,
        `$${vendor.pricing.startingPrice}`,
        `${vendor.technicalSpecs.uptime}%`,
        vendor.support.userRating
      ].join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'fms-vendor-comparison.csv';
    link.click();
    window.URL.revokeObjectURL(url);
  }, [filteredVendors]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-white flex items-center gap-2">
            <BarChart3 className="w-6 h-6" />
            FMS Vendor Comparison Matrix
          </h2>
          <p className="text-gray-400 mt-1">
            Comprehensive comparison of Fleet Management System vendors
          </p>
        </div>
        
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="px-3 py-1 text-sm text-gray-300 bg-gray-700 rounded hover:bg-gray-600 transition-colors flex items-center gap-2"
          >
            <Filter className="w-4 h-4" />
            Filters
          </button>
          
          <button
            onClick={exportComparison}
            className="px-3 py-1 text-sm text-gray-300 bg-gray-700 rounded hover:bg-gray-600 transition-colors flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Export CSV
          </button>
        </div>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
          <h3 className="text-lg font-medium text-white mb-4">Comparison Filters</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Category Focus
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value as ComparisonCategory)}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white"
              >
                <option value="all">All Categories</option>
                <option value="features">Features</option>
                <option value="technical">Technical Specs</option>
                <option value="pricing">Pricing</option>
                <option value="support">Support</option>
                <option value="compliance">Compliance</option>
                <option value="metrics">Market Metrics</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Sort By
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white"
              >
                <option value="marketShare">Market Share</option>
                <option value="customerSatisfaction">Customer Satisfaction</option>
                <option value="pricing">Starting Price</option>
                <option value="established">Year Established</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Vendors to Compare
              </label>
              <div className="space-y-2 max-h-32 overflow-y-auto">
                {fmsVendors.map((vendor) => (
                  <label key={vendor.id} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={selectedVendors.includes(vendor.id)}
                      onChange={() => toggleVendorSelection(vendor.id)}
                      className="rounded border-gray-600 bg-gray-700 text-orange-500 focus:ring-orange-500"
                    />
                    <span className="text-sm text-gray-300">{vendor.name}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Market Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Market Leader</p>
              <p className="text-lg font-semibold text-white">Caterpillar</p>
              <p className="text-sm text-orange-400">31.2% share</p>
            </div>
            <Award className="w-8 h-8 text-yellow-500" />
          </div>
        </div>
        
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Highest Rated</p>
              <p className="text-lg font-semibold text-white">Caterpillar</p>
              <p className="text-sm text-green-400">4.8/5 rating</p>
            </div>
            <Star className="w-8 h-8 text-yellow-500" />
          </div>
        </div>
        
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Most Affordable</p>
              <p className="text-lg font-semibold text-white">Wenco</p>
              <p className="text-sm text-green-400">$95/month</p>
            </div>
            <DollarSign className="w-8 h-8 text-green-500" />
          </div>
        </div>
        
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Fastest Growing</p>
              <p className="text-lg font-semibold text-white">Hexagon</p>
              <p className="text-sm text-blue-400">15.6% growth</p>
            </div>
            <TrendingUp className="w-8 h-8 text-blue-500" />
          </div>
        </div>
      </div>

      {/* Comparison Table */}
      <div className="bg-gray-800 border border-gray-700 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Vendor
                </th>
                {filteredVendors.map((vendor) => (
                  <th key={vendor.id} className="px-6 py-3 text-center text-xs font-medium text-gray-300 uppercase tracking-wider">
                    <div className="flex flex-col items-center space-y-2">
                      <span className="text-2xl">{vendor.logo}</span>
                      <span>{vendor.name}</span>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            
            <tbody className="bg-gray-800 divide-y divide-gray-700">
              {/* Basic Information */}
              {(selectedCategory === 'all' || selectedCategory === 'metrics') && (
                <>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-300">
                      Market Share
                    </td>
                    {filteredVendors.map((vendor) => (
                      <td key={vendor.id} className="px-6 py-4 whitespace-nowrap text-sm text-gray-300 text-center">
                        <div className="flex flex-col items-center">
                          <span className="font-semibold">{vendor.marketShare}%</span>
                          <div className="w-16 bg-gray-700 rounded-full h-2 mt-1">
                            <div
                              className="bg-orange-500 h-2 rounded-full"
                              style={{ width: `${(vendor.marketShare / 35) * 100}%` }}
                            ></div>
                          </div>
                        </div>
                      </td>
                    ))}
                  </tr>
                  
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-300">
                      Established
                    </td>
                    {filteredVendors.map((vendor) => (
                      <td key={vendor.id} className="px-6 py-4 whitespace-nowrap text-sm text-gray-300 text-center">
                        {vendor.established}
                      </td>
                    ))}
                  </tr>
                  
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-300">
                      Global Presence
                    </td>
                    {filteredVendors.map((vendor) => (
                      <td key={vendor.id} className="px-6 py-4 whitespace-nowrap text-sm text-gray-300 text-center">
                        {vendor.globalPresence} countries
                      </td>
                    ))}
                  </tr>
                </>
              )}
              
              {/* Features */}
              {(selectedCategory === 'all' || selectedCategory === 'features') && (
                <>
                  <tr className="bg-gray-750">
                    <td colSpan={filteredVendors.length + 1} className="px-6 py-3 text-sm font-medium text-orange-400 uppercase">
                      Features
                    </td>
                  </tr>
                  
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-300">
                      Real-time Tracking
                    </td>
                    {filteredVendors.map((vendor) => (
                      <td key={vendor.id} className="px-6 py-4 whitespace-nowrap text-sm text-gray-300 text-center">
                        {renderFeatureCell(vendor.features.realTimeTracking)}
                      </td>
                    ))}
                  </tr>
                  
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-300">
                      Route Optimization
                    </td>
                    {filteredVendors.map((vendor) => (
                      <td key={vendor.id} className="px-6 py-4 whitespace-nowrap text-sm text-gray-300 text-center">
                        {renderFeatureCell(vendor.features.routeOptimization)}
                      </td>
                    ))}
                  </tr>
                  
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-300">
                      AI Optimization
                    </td>
                    {filteredVendors.map((vendor) => (
                      <td key={vendor.id} className="px-6 py-4 whitespace-nowrap text-sm text-gray-300 text-center">
                        {renderFeatureCell(vendor.features.aiOptimization)}
                      </td>
                    ))}
                  </tr>
                  
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-300">
                      Cloud Deployment
                    </td>
                    {filteredVendors.map((vendor) => (
                      <td key={vendor.id} className="px-6 py-4 whitespace-nowrap text-sm text-gray-300 text-center">
                        {renderFeatureCell(vendor.features.cloudDeployment)}
                      </td>
                    ))}
                  </tr>
                  
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-300">
                      Mobile App
                    </td>
                    {filteredVendors.map((vendor) => (
                      <td key={vendor.id} className="px-6 py-4 whitespace-nowrap text-sm text-gray-300 text-center">
                        {renderFeatureCell(vendor.features.mobileApp)}
                      </td>
                    ))}
                  </tr>
                </>
              )}
              
              {/* Technical Specifications */}
              {(selectedCategory === 'all' || selectedCategory === 'technical') && (
                <>
                  <tr className="bg-gray-750">
                    <td colSpan={filteredVendors.length + 1} className="px-6 py-3 text-sm font-medium text-orange-400 uppercase">
                      Technical Specifications
                    </td>
                  </tr>
                  
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-300">
                      Max Equipment
                    </td>
                    {filteredVendors.map((vendor) => (
                      <td key={vendor.id} className="px-6 py-4 whitespace-nowrap text-sm text-gray-300 text-center">
                        {vendor.technicalSpecs.maxEquipment.toLocaleString()}
                      </td>
                    ))}
                  </tr>
                  
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-300">
                      Uptime
                    </td>
                    {filteredVendors.map((vendor) => (
                      <td key={vendor.id} className="px-6 py-4 whitespace-nowrap text-sm text-gray-300 text-center">
                        <span className={vendor.technicalSpecs.uptime >= 99.9 ? 'text-green-400' : vendor.technicalSpecs.uptime >= 99.5 ? 'text-yellow-400' : 'text-red-400'}>
                          {vendor.technicalSpecs.uptime}%
                        </span>
                      </td>
                    ))}
                  </tr>
                  
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-300">
                      Latency
                    </td>
                    {filteredVendors.map((vendor) => (
                      <td key={vendor.id} className="px-6 py-4 whitespace-nowrap text-sm text-gray-300 text-center">
                        <span className={vendor.technicalSpecs.latency <= 50 ? 'text-green-400' : vendor.technicalSpecs.latency <= 75 ? 'text-yellow-400' : 'text-red-400'}>
                          {vendor.technicalSpecs.latency}ms
                        </span>
                      </td>
                    ))}
                  </tr>
                  
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-300">
                      Integration Complexity
                    </td>
                    {filteredVendors.map((vendor) => (
                      <td key={vendor.id} className="px-6 py-4 whitespace-nowrap text-sm text-gray-300 text-center">
                        <span className={`px-2 py-1 rounded text-xs ${
                          vendor.technicalSpecs.integrationComplexity === 'Low' ? 'bg-green-900/50 text-green-400' :
                          vendor.technicalSpecs.integrationComplexity === 'Medium' ? 'bg-yellow-900/50 text-yellow-400' :
                          'bg-red-900/50 text-red-400'
                        }`}>
                          {vendor.technicalSpecs.integrationComplexity}
                        </span>
                      </td>
                    ))}
                  </tr>
                </>
              )}
              
              {/* Pricing */}
              {(selectedCategory === 'all' || selectedCategory === 'pricing') && (
                <>
                  <tr className="bg-gray-750">
                    <td colSpan={filteredVendors.length + 1} className="px-6 py-3 text-sm font-medium text-orange-400 uppercase">
                      Pricing
                    </td>
                  </tr>
                  
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-300">
                      Pricing Model
                    </td>
                    {filteredVendors.map((vendor) => (
                      <td key={vendor.id} className="px-6 py-4 whitespace-nowrap text-sm text-gray-300 text-center">
                        {vendor.pricing.model}
                      </td>
                    ))}
                  </tr>
                  
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-300">
                      Starting Price
                    </td>
                    {filteredVendors.map((vendor) => (
                      <td key={vendor.id} className="px-6 py-4 whitespace-nowrap text-sm text-gray-300 text-center">
                        {vendor.pricing.startingPrice === 0 ? 'Custom' : `$${vendor.pricing.startingPrice}`}
                      </td>
                    ))}
                  </tr>
                  
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-300">
                      Setup Fee
                    </td>
                    {filteredVendors.map((vendor) => (
                      <td key={vendor.id} className="px-6 py-4 whitespace-nowrap text-sm text-gray-300 text-center">
                        ${vendor.pricing.setupFee.toLocaleString()}
                      </td>
                    ))}
                  </tr>
                </>
              )}
              
              {/* Support */}
              {(selectedCategory === 'all' || selectedCategory === 'support') && (
                <>
                  <tr className="bg-gray-750">
                    <td colSpan={filteredVendors.length + 1} className="px-6 py-3 text-sm font-medium text-orange-400 uppercase">
                      Support
                    </td>
                  </tr>
                  
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-300">
                      Availability
                    </td>
                    {filteredVendors.map((vendor) => (
                      <td key={vendor.id} className="px-6 py-4 whitespace-nowrap text-sm text-gray-300 text-center">
                        {vendor.support.availability}
                      </td>
                    ))}
                  </tr>
                  
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-300">
                      User Rating
                    </td>
                    {filteredVendors.map((vendor) => (
                      <td key={vendor.id} className="px-6 py-4 whitespace-nowrap text-sm text-gray-300 text-center">
                        {renderStarRating(vendor.support.userRating)}
                      </td>
                    ))}
                  </tr>
                </>
              )}
              
              {/* Market Metrics */}
              {(selectedCategory === 'all' || selectedCategory === 'metrics') && (
                <>
                  <tr className="bg-gray-750">
                    <td colSpan={filteredVendors.length + 1} className="px-6 py-3 text-sm font-medium text-orange-400 uppercase">
                      Market Metrics
                    </td>
                  </tr>
                  
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-300">
                      Customer Satisfaction
                    </td>
                    {filteredVendors.map((vendor) => (
                      <td key={vendor.id} className="px-6 py-4 whitespace-nowrap text-sm text-gray-300 text-center">
                        {renderStarRating(vendor.marketMetrics.customerSatisfaction)}
                      </td>
                    ))}
                  </tr>
                  
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-300">
                      ROI Timeframe
                    </td>
                    {filteredVendors.map((vendor) => (
                      <td key={vendor.id} className="px-6 py-4 whitespace-nowrap text-sm text-gray-300 text-center">
                        <span className={vendor.marketMetrics.roiTimeframe <= 8 ? 'text-green-400' : vendor.marketMetrics.roiTimeframe <= 12 ? 'text-yellow-400' : 'text-red-400'}>
                          {vendor.marketMetrics.roiTimeframe} months
                        </span>
                      </td>
                    ))}
                  </tr>
                </>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}