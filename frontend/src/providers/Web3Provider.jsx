import '@rainbow-me/rainbowkit/styles.css';
import { RainbowKitProvider, lightTheme } from '@rainbow-me/rainbowkit';
import { WagmiProvider } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { sepolia } from 'wagmi/chains';
import { createConfig, http, injected } from 'wagmi';

const config = createConfig({
  chains: [sepolia],
  connectors: [injected({ name: 'MetaMask' })],
  transports: {
    [sepolia.id]: http(`https://eth-sepolia.g.alchemy.com/v2/${VITE_INFURIA_PROJECT_ID}` , {
      fallback: [ 'https://sepolia.infura.io/v3/YOUR_INFURA_PROJECT_ID',  'https://rpc.sepolia.org'],
      timeout: 10000, // 10 seconds
      retry: 3,
    }),
  },
  ssr: false,
});

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 5,
      retryDelay: 2000,
      staleTime: 10000,
    },
  },
});

export default function Web3Provider({ children }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider
          theme={lightTheme({
            accentColor: '#16A34A',
            accentColorForeground: 'white',
            borderRadius: 'medium',
            fontStack: 'system',
          })}
        >
          {children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
