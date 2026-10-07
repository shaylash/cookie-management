const getContainerHeights = () => {
  const container = document.querySelector('.cookie-management') as HTMLElement;
  const shadowRoot = container.shadowRoot!;
  const banner = shadowRoot.querySelector('.ct-banner')!;
  const collapse = shadowRoot.querySelector('.ct-collapse')!;
  const acceptance = shadowRoot.querySelector('.ct-acceptance')!;
  const contentHeight =
    acceptance.getBoundingClientRect().bottom - banner.getBoundingClientRect().top;

  return {
    collapsedHeight: contentHeight - collapse.getBoundingClientRect().height,
    containerOffset: parseFloat(window.getComputedStyle(container).bottom) * 2,
  };
};

export default getContainerHeights;
