'use client';

import React, { useState } from 'react';
import { 
  Shield, 
  Lock, 
  Key, 
  AlertTriangle, 
  Eye, 
  Zap,
  Users,
  Monitor,
  Server,
  Cloud,
  Info
} from 'lucide-react';

// Security zone definitions for ISA-95 levels
interface SecurityZone {
  id: string;
  name: string;
  levels: number[];
  description: string;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  accessControls: string[];
  threats: string[];
  protections: string[];
  examples: string[];
  compliance: string[];
}

const SECURITY_ZONES: SecurityZone[] = [
  {
    id: 'operational',
    name: 'Operational Technology (OT) Zone',
    levels: [0, 1, 2],
    description: 'Direct control of physical mining operations with real-time requirements',
    riskLevel: 'critical',
    accessControls: [
      'Physical access controls to control rooms',
      'Network segmentation with industrial firewalls',
      'Role-based authentication for operators',
      'Emergency override procedures'
    ],
    threats: [
      'Malware targeting industrial systems',
      'Unauthorized access to control systems',
      'Man-in-the-middle attacks on field communications',
      'Physical tampering with equipment'
    ],
    protections: [
      'Air-gapped networks where possible',
      'Industrial firewalls with deep packet inspection',
      'Continuous monitoring of OT communications',
      'Physical security for critical infrastructure'
    ],
    examples: [
      'XRF analyzers protected by encrypted communications',
      'PLC networks isolated from corporate IT',
      'SCADA systems with dedicated secure channels'
    ],
    compliance: [
      'IEC 62443 (Industrial Communication Networks)',
      'NIST Cybersecurity Framework',
      'ISO 27001 (Information Security Management)'
    ]
  },
  {
    id: 'business',
    name: 'Information Technology (IT) Zone',
    levels: [3, 4, 5],
    description: 'Business systems and analytics with standard IT security practices',
    riskLevel: 'high',
    accessControls: [
      'Multi-factor authentication (MFA)',
      'Single sign-on (SSO) integration',
      'Role-based access control (RBAC)',
      'Regular access reviews and deprovisioning'
    ],
    threats: [
      'Phishing and social engineering attacks',
      'Data breaches and exfiltration',
      'Insider threats and privilege escalation',
      'Cloud service vulnerabilities'
    ],
    protections: [
      'Enterprise antivirus and endpoint protection',
      'Data loss prevention (DLP) systems',
      'Security information and event management (SIEM)',
      'Regular security awareness training'
    ],
    examples: [
      'ERP systems with encrypted data at rest',
      'Business intelligence dashboards with audit logs',
      'Executive reporting with data classification'
    ],
    compliance: [
      'SOX (Sarbanes-Oxley Act)',
      'GDPR (General Data Protection Regulation)',
      'SOC 2 Type II compliance'
    ]
  }
];

// Security boundary transitions between zones
interface SecurityBoundary {
  id: string;
  fromLevel: number;
  toLevel: number;
  name: string;
  description: string;
  securityMeasures: string[];
  dataFlow: 'bidirectional' | 'upward' | 'downward';
  protocols: string[];
  riskMitigation: string[];
}

const SECURITY_BOUNDARIES: SecurityBoundary[] = [
  {
    id: 'ot-it-boundary',
    fromLevel: 2,
    toLevel: 3,
    name: 'OT/IT Security Boundary',
    description: 'Critical boundary between operational and business networks',
    securityMeasures: [
      'Industrial DMZ (demilitarized zone)',
      'Protocol translation and data validation',
      'Unidirectional gateways for critical data',
      'Audit logging of all cross-boundary communications'
    ],
    dataFlow: 'bidirectional',
    protocols: ['OPC UA', 'REST API', 'Message queues'],
    riskMitigation: [
      'Network segmentation prevents lateral movement',
      'Protocol whitelisting blocks unauthorized communications',
      'Data diodes ensure one-way flow for sensitive operations',
      'Continuous monitoring detects anomalous behavior'
    ]
  },
  {
    id: 'internal-cloud-boundary',
    fromLevel: 4,
    toLevel: 5,
    name: 'Internal/Cloud Security Boundary',
    description: 'Boundary between on-premises and cloud-based systems',
    securityMeasures: [
      'VPN tunnels with certificate-based authentication',
      'Cloud access security broker (CASB)',
      'Data encryption in transit and at rest',
      'Cloud security posture management (CSPM)'
    ],
    dataFlow: 'bidirectional',
    protocols: ['HTTPS/TLS', 'SFTP', 'API gateways'],
    riskMitigation: [
      'Zero-trust architecture validates every connection',
      'Data residency controls ensure compliance',
      'Cloud monitoring provides visibility into access patterns',
      'Backup and disaster recovery in multiple regions'
    ]
  }
];

interface SecurityBoundaryHighlightProps {
  className?: string;
  selectedLevel?: number;
  showDetails?: boolean;
  onBoundarySelect?: (boundary: SecurityBoundary) => void;
}

export const SecurityBoundaryHighlight: React.FC<SecurityBoundaryHighlightProps> = ({
  className = '',
  selectedLevel,
  showDetails = true,
  onBoundarySelect
}) => {
  const [selectedZone, setSelectedZone] = useState<string | null>(null);
  const [selectedBoundary, setSelectedBoundary] = useState<string | null>(null);

  const getZoneForLevel = (level: number): SecurityZone | undefined => {
    return SECURITY_ZONES.find(zone => zone.levels.includes(level));
  };

  const getRiskColor = (riskLevel: string) => {
    switch (riskLevel) {
      case 'low': return 'text-green-400 bg-green-500/10 border-green-500/30';
      case 'medium': return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/30';
      case 'high': return 'text-orange-400 bg-orange-500/10 border-orange-500/30';
      case 'critical': return 'text-red-400 bg-red-500/10 border-red-500/30';
      default: return 'text-slate-400 bg-slate-500/10 border-slate-500/30';
    }
  };

  const getZoneIcon = (zoneId: string) => {
    switch (zoneId) {
      case 'operational': return <Zap className="w-5 h-5" />;
      case 'business': return <Cloud className="w-5 h-5" />;
      default: return <Shield className="w-5 h-5" />;
    }
  };

  return (
    <div className={`bg-slate-800 border border-slate-600 rounded-xl p-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center space-x-3 mb-6">
        <Shield className="w-6 h-6 text-yellow-400" />
        <div>
          <h3 className="text-lg font-semibold text-white">Security Boundary Analysis</h3>
          <p className="text-sm text-slate-400">
            Critical security zones and boundaries in mining ISA-95 architecture
          </p>
        </div>
      </div>

      {/* Security Zones Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {SECURITY_ZONES.map(zone => (
          <div
            key={zone.id}
            className={`
              border-2 rounded-xl p-4 cursor-pointer transition-all duration-300
              ${selectedZone === zone.id 
                ? 'border-yellow-400 bg-yellow-500/5 scale-105' 
                : 'border-slate-600 hover:border-yellow-500/50'
              }
              ${getRiskColor(zone.riskLevel).includes('bg-') ? getRiskColor(zone.riskLevel) : ''}
            `}
            onClick={() => setSelectedZone(selectedZone === zone.id ? null : zone.id)}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                {getZoneIcon(zone.id)}
                <h4 className="font-semibold text-white">{zone.name}</h4>
              </div>
              <div className={`px-2 py-1 rounded-full text-xs font-medium border ${getRiskColor(zone.riskLevel)}`}>
                {zone.riskLevel.toUpperCase()}
              </div>
            </div>

            <p className="text-sm text-slate-300 mb-3">{zone.description}</p>

            <div className="flex items-center space-x-4 mb-3">
              <div className="text-xs text-slate-400">
                <span className="font-medium">Levels:</span> {zone.levels.join(', ')}
              </div>
            </div>

            {selectedZone === zone.id && showDetails && (
              <div className="mt-4 pt-4 border-t border-slate-600 space-y-4">
                {/* Access Controls */}
                <div>
                  <div className="flex items-center space-x-2 mb-2">
                    <Key className="w-4 h-4 text-blue-400" />
                    <span className="text-sm font-medium text-white">Access Controls</span>
                  </div>
                  <ul className="space-y-1">
                    {zone.accessControls.map((control, index) => (
                      <li key={index} className="text-xs text-slate-300 flex items-start space-x-2">
                        <span className="text-blue-400 mt-1">•</span>
                        <span>{control}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Threats */}
                <div>
                  <div className="flex items-center space-x-2 mb-2">
                    <AlertTriangle className="w-4 h-4 text-red-400" />
                    <span className="text-sm font-medium text-white">Primary Threats</span>
                  </div>
                  <ul className="space-y-1">
                    {zone.threats.map((threat, index) => (
                      <li key={index} className="text-xs text-slate-300 flex items-start space-x-2">
                        <span className="text-red-400 mt-1">•</span>
                        <span>{threat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Protections */}
                <div>
                  <div className="flex items-center space-x-2 mb-2">
                    <Lock className="w-4 h-4 text-green-400" />
                    <span className="text-sm font-medium text-white">Protection Measures</span>
                  </div>
                  <ul className="space-y-1">
                    {zone.protections.map((protection, index) => (
                      <li key={index} className="text-xs text-slate-300 flex items-start space-x-2">
                        <span className="text-green-400 mt-1">•</span>
                        <span>{protection}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Security Boundaries */}
      <div className="space-y-6">
        <div className="flex items-center space-x-2">
          <Users className="w-5 h-5 text-purple-400" />
          <h4 className="text-lg font-semibold text-white">Critical Security Boundaries</h4>
        </div>

        {SECURITY_BOUNDARIES.map(boundary => (
          <div
            key={boundary.id}
            className={`
              border-2 rounded-xl p-4 cursor-pointer transition-all duration-300
              ${selectedBoundary === boundary.id 
                ? 'border-purple-400 bg-purple-500/5 scale-105' 
                : 'border-slate-600 hover:border-purple-500/50'
              }
            `}
            onClick={() => {
              const newBoundary = selectedBoundary === boundary.id ? null : boundary.id;
              setSelectedBoundary(newBoundary);
              if (newBoundary && onBoundarySelect) {
                onBoundarySelect(boundary);
              }
            }}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <Monitor className="w-5 h-5 text-purple-400" />
                <h5 className="font-semibold text-white">{boundary.name}</h5>
              </div>
              <div className="text-xs text-slate-400">
                Level {boundary.fromLevel} ↔ Level {boundary.toLevel}
              </div>
            </div>

            <p className="text-sm text-slate-300 mb-3">{boundary.description}</p>

            {selectedBoundary === boundary.id && showDetails && (
              <div className="mt-4 pt-4 border-t border-slate-600 space-y-4">
                {/* Security Measures */}
                <div>
                  <div className="flex items-center space-x-2 mb-2">
                    <Shield className="w-4 h-4 text-yellow-400" />
                    <span className="text-sm font-medium text-white">Security Measures</span>
                  </div>
                  <ul className="space-y-1">
                    {boundary.securityMeasures.map((measure, index) => (
                      <li key={index} className="text-xs text-slate-300 flex items-start space-x-2">
                        <span className="text-yellow-400 mt-1">•</span>
                        <span>{measure}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Protocols */}
                <div>
                  <div className="flex items-center space-x-2 mb-2">
                    <Server className="w-4 h-4 text-blue-400" />
                    <span className="text-sm font-medium text-white">Approved Protocols</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {boundary.protocols.map((protocol, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-blue-500/20 border border-blue-500/30 rounded text-xs text-blue-300"
                      >
                        {protocol}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Risk Mitigation */}
                <div>
                  <div className="flex items-center space-x-2 mb-2">
                    <Eye className="w-4 h-4 text-green-400" />
                    <span className="text-sm font-medium text-white">Risk Mitigation</span>
                  </div>
                  <ul className="space-y-1">
                    {boundary.riskMitigation.map((mitigation, index) => (
                      <li key={index} className="text-xs text-slate-300 flex items-start space-x-2">
                        <span className="text-green-400 mt-1">•</span>
                        <span>{mitigation}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Selected Level Context */}
      {selectedLevel !== undefined && (
        <div className="mt-6 bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <Info className="w-4 h-4 text-blue-400" />
            <span className="text-sm font-medium text-blue-300">
              Security Context for Level {selectedLevel}
            </span>
          </div>
          {(() => {
            const zone = getZoneForLevel(selectedLevel);
            if (zone) {
              return (
                <div className="text-xs text-blue-200">
                  <p className="mb-2">
                    <strong>Zone:</strong> {zone.name} ({zone.riskLevel} risk)
                  </p>
                  <p>
                    <strong>Key Protection:</strong> {zone.protections[0]}
                  </p>
                </div>
              );
            }
            return <p className="text-xs text-blue-200">No specific security zone defined for this level.</p>;
          })()}
        </div>
      )}

      {/* Help Text */}
      <div className="mt-6 bg-slate-900 border border-slate-700 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <AlertTriangle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="text-sm font-medium text-yellow-300 mb-1">Mining Security Best Practices</h4>
            <p className="text-xs text-yellow-200">
              Mining operations require specialized security approaches due to the critical nature of OT systems
              and the remote/harsh environment. The boundary between operational and business networks is 
              particularly critical as it protects safety-critical systems while enabling business intelligence.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SecurityBoundaryHighlight;