import { Fragment, FunctionalComponent, h } from 'preact';
import Banner from './banner';
import Customization from './customization';
import { useEffect } from 'preact/hooks';
import { Config, CookieOption, CookieOptions } from '../types';
import useCookie from '../hooks/useCookie';
import './app.css';
import { setVisible, isEssential } from '../utils';
import { EventEmitter } from 'events';

interface Props extends Config {
  ee?: EventEmitter;
}

export const CONTAINER_WIDTHS = ['360px', '380px', '425px', '500px'];

/**
 * Sets the width of the modal in case the user has a larger font size
 */
const setModalWidth = () => {
  const rootNode = document.querySelector('.cookie-management') as HTMLDivElement;
  const textNode = rootNode.shadowRoot!.querySelector('.ct-banner-explanation') as HTMLDivElement;
  const textFontSize = +window.getComputedStyle(textNode).fontSize.slice(0, -2);
  const isMobile = window.innerWidth < 768;

  rootNode.setAttribute('data-lenis-prevent', 'true');

  if (isMobile) {
    rootNode.style.removeProperty('width');
    return;
  }

  if (13 < textFontSize && textFontSize <= 14) {
    rootNode.style.width = CONTAINER_WIDTHS[0];
  }

  if (14 < textFontSize && textFontSize <= 16) {
    rootNode.style.width = CONTAINER_WIDTHS[1];
  }

  if (16 < textFontSize && textFontSize <= 18) {
    rootNode.style.width = CONTAINER_WIDTHS[2];
  }

  if (textFontSize > 18) {
    rootNode.style.width = CONTAINER_WIDTHS[3];
  }
};

const App: FunctionalComponent<Props> = ({
  policies,
  cookiePreferenceKey,
  header,
  customizeLabel,
  domain,
  cookiePolicy,
  permissionLabels,
  essentialLabel,
  ee,
}) => {
  const { getCookiePreferences, setCookiePreferences } = useCookie({
    cookieOptions: policies.map(policy => ({
      id: policy.id,
      isEnabled: isEssential(policy.category),
    })),
    ee,
    cookiePreferenceKey,
    domain,
  });
  const getCookieOptions = (): CookieOptions => {
    const preferences = getCookiePreferences();
    const cookieOptions = preferences.cookieOptions.map(option => {
      const policyToMerge = policies.find(policy => policy.id === option.id);
      return { ...policyToMerge, ...option } as CookieOption;
    });

    return { ...preferences, cookieOptions };
  };
  const cookiePreferences = getCookieOptions();

  useEffect(() => {
    setModalWidth();
    if (!cookiePreferences.isCustomised) {
      setVisible(true);
    }
  }, [cookiePreferences]);

  return (
    <Fragment>
      <Banner header={header} />
      <Customization
        cookieOptions={cookiePreferences.cookieOptions}
        cookiePolicy={cookiePolicy}
        customizeLabel={customizeLabel}
        permissionLabels={permissionLabels}
        essentialLabel={essentialLabel}
        setCookiePreferences={setCookiePreferences}
        onWindowResize={setModalWidth}
      />
    </Fragment>
  );
};
export default App;
