import getContainerHeights from '../../utils/getContainerHeights';

describe('getContainerHeights', () => {
  const createElement = (className: string, rect: Partial<DOMRect>) => {
    const element = document.createElement('div');
    element.className = className;
    element.getBoundingClientRect = () => ({ top: 0, bottom: 0, height: 0, ...rect } as DOMRect);
    return element;
  };

  it('can get the containerHeights', () => {
    const container = document.createElement('div');
    container.className = 'cookie-management';
    container.style.bottom = '16px';
    container.attachShadow({ mode: 'open' });

    container.shadowRoot!.append(
      createElement('ct-banner', { top: 100 }),
      createElement('ct-collapse', { height: 200 }),
      createElement('ct-acceptance', { bottom: 600 }),
    );

    document.body.appendChild(container);

    expect(getContainerHeights()).toEqual({ collapsedHeight: 300, containerOffset: 32 });
  });
});
