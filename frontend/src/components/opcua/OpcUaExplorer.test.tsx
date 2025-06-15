import { render } from '@testing-library/react';
import OpcUaExplorer from './OpcUaExplorer';

describe('OpcUaExplorer', () => {
  it('should render without errors', () => {
    const { container } = render(
      <OpcUaExplorer nodes={[]} />
    );
    expect(container).toBeTruthy();
  });
});