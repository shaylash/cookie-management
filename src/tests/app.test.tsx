import { h } from 'preact';
import { shallow, mount } from 'enzyme';
import toJson from 'enzyme-to-json';
import { englishMockPolicies } from './__mocks__/policies';
import { COOKIE_PREFERENCES_KEY, formatToCookie } from '../hooks/useCookie';
import { englishMockConfig } from './__mocks__/config';
import App, { CONTAINER_WIDTHS } from '../components/app';
import clearCookies from './helpers/clearCookies';
import { CookiePreferences } from '../types';

jest.mock('../utils/dom', () => ({
  setVisible: jest.fn().mockImplementation(() => 'You have called setVisible'),
}));
import { setVisible } from '../utils/dom';
const { description } = englishMockConfig.header;

describe('Cookie Though', () => {
  let container: HTMLDivElement;
  beforeAll(() => {
    Object.defineProperty(window, 'getComputedStyle', {
      value: () => ({ fontSize: '12px', height: '0px', bottom: '0px' }),
    });
  });

  beforeEach(() => {
    const manageCookiesElement = document.createElement('button');
    manageCookiesElement.id = 'manage-cookie-management';
    document.body.append(manageCookiesElement);

    container = document.createElement('div');
    container.className = 'cookie-management';
    container.attachShadow({ mode: 'open' });

    const textDiv = document.createElement('div');
    textDiv.className = 'ct-banner-explanation';
    container.shadowRoot!.appendChild(textDiv);
    document.body.appendChild(container);
  });

  afterEach(() => {
    clearCookies();
    document.getElementsByTagName('html')[0].innerHTML = '';
  });

  describe('without cookie preferences stored in a cookie', () => {
    it('should show the cookie wall', () => {
      mount(
        <App
          customizeLabel="customize"
          header={{ description }}
          policies={englishMockConfig.policies}
          permissionLabels={englishMockConfig.permissionLabels}
        />,
        { attachTo: container },
      );

      expect(setVisible).toBeCalled();
    });
  });

  describe('with user preferences stored in a cookie', () => {
    const DEFAULT_COOKIE_PREFERENCES: CookiePreferences = {
      isCustomised: false,
      cookieOptions: englishMockConfig.policies.map(policy => ({ ...policy, isEnabled: false })),
    };

    it('should not show the cookie wall', () => {
      document.cookie = `${COOKIE_PREFERENCES_KEY}=${formatToCookie(
        DEFAULT_COOKIE_PREFERENCES.cookieOptions,
      )}`;
      mount(
        <div className="cookie-management">
          <App
            customizeLabel="customize"
            header={{ description }}
            policies={englishMockPolicies}
            permissionLabels={englishMockConfig.permissionLabels}
          />
        </div>,
        { attachTo: document.body },
      );
    });

    it("should show the cookie wall if the cookie preferences aren't customised", () => {
      jest.mock('../utils/dom', () => ({
        setVisible: jest.fn().mockImplementation(() => 'You have called setVisible'),
      }));
      mount(
        <div className="cookie-management">
          <App
            customizeLabel="customize"
            header={{ description }}
            policies={englishMockPolicies}
            permissionLabels={englishMockConfig.permissionLabels}
          />
        </div>,
        { attachTo: document.body },
      );

      expect(setVisible).toBeCalled();
    });
  });

  it('should render properly', () => {
    const wrapper = shallow(
      <body>
        <button id="manage-cookie-management"></button>
        <div className="cookie-management">
          <App
            customizeLabel="customize"
            header={{ description }}
            policies={englishMockPolicies}
            permissionLabels={englishMockConfig.permissionLabels}
          />
        </div>
      </body>,
    );
    expect(toJson(wrapper)).toMatchSnapshot();
  });

  describe('if the user has a different browser font setting', () => {
    const renderApp = (fontSize: string) => {
      container.style.fontSize = fontSize;
      return mount(
        <App
          customizeLabel="customize"
          header={{ description }}
          policies={englishMockPolicies}
          permissionLabels={englishMockConfig.permissionLabels}
        />,
        { attachTo: container },
      );
    };

    const mockGetComputedStyle = (size: number) => {
      Object.defineProperty(window, 'getComputedStyle', {
        value: () => ({ fontSize: `${size}px`, height: '0px', bottom: '0px' }),
      });
    };

    it('should adjust the width of the container based on the font', () => {
      const fontSizes = [13.5, 15, 17, 19, 23];
      const expectedWidths = [0, 1, 2, 3, 3].map(i => CONTAINER_WIDTHS[i]);
      fontSizes.forEach((fontSize, i) => {
        mockGetComputedStyle(fontSize);
        renderApp(`${fontSize}px`);
        const container = document.querySelector('.cookie-management') as HTMLElement;
        expect(container.style.width).toEqual(expectedWidths[i]);
      });
    });

    it('should not adjust the width of the container if the width is smaller than the breakpoint', () => {
      global.innerWidth = 375;
      const fontSizes = [13.5, 15, 17, 19, 23];
      fontSizes.forEach(fontSize => {
        mockGetComputedStyle(fontSize);
        renderApp(`${fontSize}px`);
        const container = document.querySelector('.cookie-management') as HTMLElement;
        expect(container.style.width).toBe('');
      });
    });
  });
});
