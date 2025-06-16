'use client';

import { useState, useEffect, useMemo, Suspense, lazy } from 'react';
import * as Collapsible from '@radix-ui/react-collapsible';
import { 
  ChevronDown, 
  ChevronRight, 
  Copy, 
  Check,
  Code,
  FileCode,
  Terminal,
  Loader2
} from 'lucide-react';
import { OpcUaNode } from '@/types/websocket';

// Lazy load the syntax highlighter to improve initial load time
const SyntaxHighlighter = lazy(() => import('./SyntaxHighlighter'));

interface CodeExamplesProps {
  node: OpcUaNode | null;
  serverUrl?: string;
  className?: string;
}

interface LazyCodeExamplesProps extends CodeExamplesProps {
  isExpanded?: boolean;
}

interface CodeExample {
  language: string;
  icon: React.ReactNode;
  code: string;
}

// Generate code examples based on node
const generateExamples = (node: OpcUaNode, serverUrl: string): CodeExample[] => {
  const nodeId = node.nodeId;
  const isVariable = node.nodeClass === 'Variable';
  
  return [
    {
      language: 'JavaScript',
      icon: <FileCode className="w-4 h-4" />,
      code: `// Using node-opcua client
const { OPCUAClient, AttributeIds } = require("node-opcua");

async function readNode() {
  const client = OPCUAClient.create({
    endpoint_must_exist: false
  });
  
  try {
    await client.connect("${serverUrl}");
    const session = await client.createSession();
    
    // Read the node value
    const dataValue = await session.read({
      nodeId: "${nodeId}",
      attributeId: AttributeIds.Value
    });
    
    console.log("Value:", dataValue.value.value);
    ${isVariable ? `
    // Subscribe to changes
    const subscription = await session.createSubscription2({
      requestedPublishingInterval: 1000,
      requestedMaxKeepAliveCount: 20,
      requestedLifetimeCount: 6000,
      maxNotificationsPerPublish: 1000,
      publishingEnabled: true,
      priority: 10
    });
    
    const monitoredItem = await subscription.monitor({
      nodeId: "${nodeId}",
      attributeId: AttributeIds.Value
    }, {
      samplingInterval: 100,
      discardOldest: true,
      queueSize: 10
    });
    
    monitoredItem.on("changed", (dataValue) => {
      console.log("New value:", dataValue.value.value);
    });` : ''}
    
    await session.close();
    await client.disconnect();
  } catch (err) {
    console.error("Error:", err);
  }
}`
    },
    {
      language: 'Python',
      icon: <FileCode className="w-4 h-4" />,
      code: `# Using python-opcua library
from opcua import Client
import time

def read_node():
    client = Client("${serverUrl}")
    
    try:
        client.connect()
        
        # Get the node
        node = client.get_node("${nodeId}")
        
        # Read current value
        value = node.get_value()
        print(f"Value: {value}")
        ${isVariable ? `
        # Subscribe to changes
        class SubHandler:
            def datachange_notification(self, node, val, data):
                print(f"New value: {val}")
        
        handler = SubHandler()
        sub = client.create_subscription(1000, handler)
        handle = sub.subscribe_data_change(node)
        
        # Keep running for 30 seconds
        time.sleep(30)
        
        sub.unsubscribe(handle)
        sub.delete()` : ''}
        
    except Exception as e:
        print(f"Error: {e}")
    finally:
        client.disconnect()

if __name__ == "__main__":
    read_node()`
    },
    {
      language: 'REST API',
      icon: <Terminal className="w-4 h-4" />,
      code: `# Read node value via REST API
curl -X GET "${serverUrl.replace('opc.tcp', 'http')}/api/opcua/read" \\
  -H "Content-Type: application/json" \\
  -d '{
    "nodeId": "${nodeId}"
  }'

# Response:
# {
#   "nodeId": "${nodeId}",
#   "value": ${node.value !== undefined ? JSON.stringify(node.value) : '...'},
#   "dataType": "${node.dataType || 'Unknown'}",
#   "timestamp": "2024-01-15T10:30:00Z"
# }
${isVariable ? `
# Subscribe to node updates
curl -X POST "${serverUrl.replace('opc.tcp', 'http')}/api/opcua/subscribe" \\
  -H "Content-Type: application/json" \\
  -d '{
    "nodeId": "${nodeId}",
    "interval": 1000
  }'

# WebSocket connection for real-time updates
wscat -c "${serverUrl.replace('opc.tcp', 'ws')}/ws" \\
  -x '{"type": "subscribe", "nodeId": "${nodeId}"}'` : ''}`
    }
  ];
};

function CodeSection({ example, node }: { example: CodeExample; node: OpcUaNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(example.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };
  
  return (
    <Collapsible.Root open={isOpen} onOpenChange={setIsOpen}>
      <div className="flex items-center justify-between p-3 bg-slate-700 hover:bg-slate-600 rounded transition-colors">
        <Collapsible.Trigger className="flex-1 flex items-center space-x-2 cursor-pointer">
          {isOpen ? (
            <ChevronDown className="w-4 h-4 text-gray-400" />
          ) : (
            <ChevronRight className="w-4 h-4 text-gray-400" />
          )}
          {example.icon}
          <span className="text-sm font-medium text-white">{example.language}</span>
        </Collapsible.Trigger>
        
        <button
          onClick={handleCopy}
          className="p-1.5 hover:bg-slate-800 rounded transition-colors ml-2"
          title="Copy code"
        >
          {copied ? (
            <Check className="w-4 h-4 text-green-400" />
          ) : (
            <Copy className="w-4 h-4 text-gray-400" />
          )}
        </button>
      </div>
      
      <Collapsible.Content>
        <div className="p-3 bg-slate-900 border-t border-slate-800">
          <Suspense 
            fallback={
              <div className="flex items-center justify-center p-4">
                <Loader2 className="w-4 h-4 animate-spin text-blue-400 mr-2" />
                <span className="text-sm text-gray-400">Loading syntax highlighter...</span>
              </div>
            }
          >
            <SyntaxHighlighter 
              code={example.code} 
              language={example.language.toLowerCase()}
              className="text-xs"
            />
          </Suspense>
        </div>
      </Collapsible.Content>
    </Collapsible.Root>
  );
}

// Lazy code examples component that only generates examples when expanded
function LazyCodeExamplesContent({ node, serverUrl, isExpanded }: LazyCodeExamplesProps & { isExpanded: boolean }) {
  const examples = useMemo(() => {
    if (!node || !isExpanded) return [];
    return generateExamples(node, serverUrl || 'opc.tcp://localhost:4840/mining-demo');
  }, [node, serverUrl, isExpanded]);

  if (!isExpanded) {
    return (
      <div className="p-4 text-center text-gray-500">
        <Code className="w-8 h-8 mx-auto mb-2 opacity-50" />
        <p className="text-sm">Expand to view code examples</p>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-2">
      {examples.map((example, index) => (
        <CodeSection 
          key={index} 
          example={example} 
          node={node!}
        />
      ))}
    </div>
  );
}

export default function CodeExamples({
  node,
  serverUrl = 'opc.tcp://localhost:4840/mining-demo',
  className = ''
}: CodeExamplesProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!node) {
    return (
      <div className={`bg-slate-800 border border-slate-600 rounded-lg p-6 ${className}`}>
        <div className="text-center text-gray-500">
          <Code className="w-12 h-12 mx-auto mb-2 opacity-50" />
          <p className="text-sm">Select a node to view code examples</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className={`bg-slate-800 border border-slate-600 rounded-lg ${className}`}>
      <div className="p-4 border-b border-slate-700">
        <h3 className="text-lg font-semibold text-white flex items-center space-x-2">
          <Code className="w-5 h-5" />
          <span>Code Examples</span>
        </h3>
        <p className="text-sm text-gray-400 mt-1">
          Access this node using different technologies
        </p>
        
        {/* Why Code Access Matters */}
        <div className="mt-3 p-3 bg-blue-500/10 border border-blue-500/20 rounded-md">
          <p className="text-xs text-gray-300">
            <strong className="text-blue-400">Why this matters:</strong> Direct node access enables:
          </p>
          <ul className="text-xs text-gray-300 mt-1 space-y-0.5 list-disc list-inside ml-2">
            <li>Real-time monitoring dashboards for operations</li>
            <li>Automated alerts when values exceed thresholds</li>
            <li>Integration with ERP/MES systems for production planning</li>
            <li>Historical data logging for compliance and optimization</li>
            <li>Custom analytics and machine learning applications</li>
          </ul>
        </div>

        {/* Expand/Collapse button */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="mt-3 flex items-center space-x-2 text-sm text-blue-400 hover:text-blue-300 transition-colors"
        >
          {isExpanded ? (
            <ChevronDown className="w-4 h-4" />
          ) : (
            <ChevronRight className="w-4 h-4" />
          )}
          <span>{isExpanded ? 'Hide' : 'Show'} Code Examples</span>
        </button>
      </div>
      
      {/* Lazy loaded content */}
      <Suspense
        fallback={
          <div className="p-4 text-center">
            <Loader2 className="w-6 h-6 animate-spin text-blue-400 mx-auto mb-2" />
            <p className="text-sm text-gray-400">Loading code examples...</p>
          </div>
        }
      >
        <LazyCodeExamplesContent 
          node={node}
          serverUrl={serverUrl}
          isExpanded={isExpanded}
        />
      </Suspense>
    </div>
  );
}