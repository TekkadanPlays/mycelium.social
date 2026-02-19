import { Component } from 'inferno';
import { createElement } from 'inferno-create-element';
import { DocsLayout } from './DocsLayout';
import { DocsIndex } from './DocsIndex';

// Blazecn pages
import { BlazecnIntro } from './blazecn/index';
import { InstallationPage } from './blazecn/InstallationPage';
import { TokensPage } from './blazecn/TokensPage';
import { CnPage } from './blazecn/CnPage';
import { ButtonPage } from './blazecn/ButtonPage';
import { BadgePage } from './blazecn/BadgePage';
import { CardPage } from './blazecn/CardPage';
import { InputPage } from './blazecn/InputPage';
import { TextareaPage } from './blazecn/TextareaPage';
import { LabelPage } from './blazecn/LabelPage';
import { SwitchPage } from './blazecn/SwitchPage';
import { CheckboxPage } from './blazecn/CheckboxPage';
import { RadioGroupPage } from './blazecn/RadioGroupPage';
import { SelectPage } from './blazecn/SelectPage';
import { SliderPage } from './blazecn/SliderPage';
import { AvatarPage } from './blazecn/AvatarPage';
import { TablePage } from './blazecn/TablePage';
import { SeparatorPage } from './blazecn/SeparatorPage';
import { SpinnerPage } from './blazecn/SpinnerPage';
import { SkeletonPage } from './blazecn/SkeletonPage';
import { ProgressPage } from './blazecn/ProgressPage';
import { AlertPage } from './blazecn/AlertPage';
import { TabsPage } from './blazecn/TabsPage';
import { TogglePage } from './blazecn/TogglePage';
import { AccordionPage } from './blazecn/AccordionPage';
import { DialogPage } from './blazecn/DialogPage';
import { TooltipPage } from './blazecn/TooltipPage';
import { ToastPage } from './blazecn/ToastPage';
import { ScrollAreaPage } from './blazecn/ScrollAreaPage';
import { AspectRatioPage } from './blazecn/AspectRatioPage';
import { ThemeTogglePage } from './blazecn/ThemeTogglePage';
import { CollapsiblePage } from './blazecn/CollapsiblePage';
import { DropdownMenuPage } from './blazecn/DropdownMenuPage';
import { PopoverPage } from './blazecn/PopoverPage';
import { SheetPage } from './blazecn/SheetPage';
import { ToggleGroupPage } from './blazecn/ToggleGroupPage';
import { BreadcrumbPage_ } from './blazecn/BreadcrumbPage';
import { PaginationPage_ } from './blazecn/PaginationPage';
import { HoverCardPage } from './blazecn/HoverCardPage';
import { AlertDialogPage } from './blazecn/AlertDialogPage';
import { CommandPage } from './blazecn/CommandPage';
import { InputOTPPage } from './blazecn/InputOTPPage';
import { CarouselPage } from './blazecn/CarouselPage';
import { ContextMenuPage } from './blazecn/ContextMenuPage';
import { DrawerPage } from './blazecn/DrawerPage';
import { MenubarPage } from './blazecn/MenubarPage';
import { NavigationMenuPage } from './blazecn/NavigationMenuPage';
import { ResizablePage } from './blazecn/ResizablePage';
import { ComboboxPage } from './blazecn/ComboboxPage';
import { KbdPage } from './blazecn/KbdPage';
import { TypographyPage } from './blazecn/TypographyPage';
import { EmptyPage } from './blazecn/EmptyPage';
import { ButtonGroupPage } from './blazecn/ButtonGroupPage';
import { SidebarPage } from './blazecn/SidebarPage';
import { ComponentsPage } from './blazecn/ComponentsPage';

// Kaji module pages
import { KajiEventPage } from './kaji/EventPage';
import { KajiKeysPage } from './kaji/KeysPage';
import { KajiSignPage } from './kaji/SignPage';
import { KajiFilterPage } from './kaji/FilterPage';
import { KajiRelayPage } from './kaji/RelayPage';
import { KajiPoolPage } from './kaji/PoolPage';
import { KajiNip07Page } from './kaji/Nip07Page';
import { KajiNip10Page } from './kaji/Nip10Page';
import { KajiNip25Page } from './kaji/Nip25Page';
import { KajiNip29Page } from './kaji/Nip29Page';
import { KajiUtilsPage } from './kaji/UtilsPage';
import { KajiNip55Page } from './kaji/Nip55Page';
import { KajiNip66Page } from './kaji/Nip66Page';

// Other project pages
import { MyceliumIntro } from './ribbit/index';
import { KajiIntro } from './kaji/index';
import { Nos2xFrogIntro } from './nos2x-frog/index';
import { BugsFixedPage } from './nos2x-frog/BugsFixedPage';
import { FixingNos2xFoxPage } from './nos2x-frog/FixingNos2xFoxPage';
import { UpgradingNos2xFoxPage } from './nos2x-frog/UpgradingNos2xFoxPage';
import { BreakingNos2xFrogPage } from './nos2x-frog/BreakingNos2xFrogPage';
import { MyceliumAndroidIndex } from './ribbit-android/index';
import { RelaySystemPage } from './ribbit-android/RelaySystemPage';
import { ScreensPage } from './ribbit-android/ScreensPage';
import { NipsIntro } from './nips/index';
import { Nips1xxPage, Nips2xxPage, Nips3xxPage, Nips4xxPage, Nips5xxPage, Nips6xxPage, Nips7xxPage, Nips8xxPage, Nips9xxPage } from './nips/CategoryPage';

// ---------------------------------------------------------------------------
// Route map
// ---------------------------------------------------------------------------

const ROUTES: Record<string, any> = {
  // Docs index
  '/docs': DocsIndex,

  // Blazecn
  '/docs/blazecn': BlazecnIntro,
  '/docs/blazecn/installation': InstallationPage,
  '/docs/blazecn/tokens': TokensPage,
  '/docs/blazecn/cn': CnPage,
  '/docs/blazecn/button': ButtonPage,
  '/docs/blazecn/badge': BadgePage,
  '/docs/blazecn/card': CardPage,
  '/docs/blazecn/input': InputPage,
  '/docs/blazecn/textarea': TextareaPage,
  '/docs/blazecn/label': LabelPage,
  '/docs/blazecn/switch': SwitchPage,
  '/docs/blazecn/checkbox': CheckboxPage,
  '/docs/blazecn/radio-group': RadioGroupPage,
  '/docs/blazecn/select': SelectPage,
  '/docs/blazecn/slider': SliderPage,
  '/docs/blazecn/avatar': AvatarPage,
  '/docs/blazecn/table': TablePage,
  '/docs/blazecn/separator': SeparatorPage,
  '/docs/blazecn/spinner': SpinnerPage,
  '/docs/blazecn/skeleton': SkeletonPage,
  '/docs/blazecn/progress': ProgressPage,
  '/docs/blazecn/alert': AlertPage,
  '/docs/blazecn/tabs': TabsPage,
  '/docs/blazecn/toggle': TogglePage,
  '/docs/blazecn/accordion': AccordionPage,
  '/docs/blazecn/dialog': DialogPage,
  '/docs/blazecn/tooltip': TooltipPage,
  '/docs/blazecn/toast': ToastPage,
  '/docs/blazecn/scroll-area': ScrollAreaPage,
  '/docs/blazecn/aspect-ratio': AspectRatioPage,
  '/docs/blazecn/theme-toggle': ThemeTogglePage,
  '/docs/blazecn/collapsible': CollapsiblePage,
  '/docs/blazecn/dropdown-menu': DropdownMenuPage,
  '/docs/blazecn/popover': PopoverPage,
  '/docs/blazecn/sheet': SheetPage,
  '/docs/blazecn/toggle-group': ToggleGroupPage,
  '/docs/blazecn/breadcrumb': BreadcrumbPage_,
  '/docs/blazecn/pagination': PaginationPage_,
  '/docs/blazecn/hover-card': HoverCardPage,
  '/docs/blazecn/alert-dialog': AlertDialogPage,
  '/docs/blazecn/command': CommandPage,
  '/docs/blazecn/input-otp': InputOTPPage,
  '/docs/blazecn/carousel': CarouselPage,
  '/docs/blazecn/context-menu': ContextMenuPage,
  '/docs/blazecn/drawer': DrawerPage,
  '/docs/blazecn/menubar': MenubarPage,
  '/docs/blazecn/navigation-menu': NavigationMenuPage,
  '/docs/blazecn/resizable': ResizablePage,
  '/docs/blazecn/combobox': ComboboxPage,
  '/docs/blazecn/kbd': KbdPage,
  '/docs/blazecn/typography': TypographyPage,
  '/docs/blazecn/empty': EmptyPage,
  '/docs/blazecn/button-group': ButtonGroupPage,
  '/docs/blazecn/sidebar': SidebarPage,
  '/docs/blazecn/components': ComponentsPage,

  // Kaji modules
  '/docs/kaji': KajiIntro,
  '/docs/kaji/event': KajiEventPage,
  '/docs/kaji/keys': KajiKeysPage,
  '/docs/kaji/sign': KajiSignPage,
  '/docs/kaji/filter': KajiFilterPage,
  '/docs/kaji/relay': KajiRelayPage,
  '/docs/kaji/pool': KajiPoolPage,
  '/docs/kaji/nip07': KajiNip07Page,
  '/docs/kaji/nip10': KajiNip10Page,
  '/docs/kaji/nip25': KajiNip25Page,
  '/docs/kaji/nip29': KajiNip29Page,
  '/docs/kaji/nip55': KajiNip55Page,
  '/docs/kaji/nip66': KajiNip66Page,
  '/docs/kaji/utils': KajiUtilsPage,

  // Other projects
  '/docs/mycelium': MyceliumIntro,
  '/docs/mycelium-android': MyceliumAndroidIndex,
  '/docs/mycelium-android/relay-system': RelaySystemPage,
  '/docs/mycelium-android/screens': ScreensPage,
  '/docs/nos2x-frog': Nos2xFrogIntro,
  '/docs/nos2x-frog/bugs-fixed': BugsFixedPage,
  '/docs/nos2x-frog/fixing-nos2x-fox': FixingNos2xFoxPage,
  '/docs/nos2x-frog/upgrading-nos2x-fox': UpgradingNos2xFoxPage,
  '/docs/nos2x-frog/breaking-nos2x-frog': BreakingNos2xFrogPage,
  '/docs/nips': NipsIntro,
  '/docs/nips/1xx': Nips1xxPage,
  '/docs/nips/2xx': Nips2xxPage,
  '/docs/nips/3xx': Nips3xxPage,
  '/docs/nips/4xx': Nips4xxPage,
  '/docs/nips/5xx': Nips5xxPage,
  '/docs/nips/6xx': Nips6xxPage,
  '/docs/nips/7xx': Nips7xxPage,
  '/docs/nips/8xx': Nips8xxPage,
  '/docs/nips/9xx': Nips9xxPage,
};

// ---------------------------------------------------------------------------
// Docs root component — reads path from props.match or window.location
// ---------------------------------------------------------------------------

interface DocsProps {
  match?: { url?: string; params?: { rest?: string } };
}

interface DocsState {
  pathname: string;
}

export class Docs extends Component<DocsProps, DocsState> {
  declare state: DocsState;
  private _unlisten: (() => void) | null = null;

  constructor(props: DocsProps) {
    super(props);
    this.state = { pathname: this._getPath() };
  }

  private _getPath(): string {
    return typeof window !== 'undefined' ? window.location.pathname : '/docs';
  }

  componentDidMount() {
    // Listen for popstate (back/forward) and pushState (Link clicks)
    const onNav = () => {
      const p = this._getPath();
      if (p !== this.state.pathname) {
        this.setState({ pathname: p });
      }
    };
    window.addEventListener('popstate', onNav);

    // Monkey-patch pushState to detect <Link> navigation
    const origPush = history.pushState.bind(history);
    history.pushState = function (data: any, unused: string, url?: string | URL | null) {
      origPush(data, unused, url);
      onNav();
    };

    this._unlisten = () => {
      window.removeEventListener('popstate', onNav);
      history.pushState = origPush;
    };
  }

  componentWillUnmount() {
    this._unlisten?.();
  }

  render() {
    const { pathname } = this.state;
    const PageComponent = ROUTES[pathname];

    // Scroll to top on page change
    if (typeof window !== 'undefined') {
      window.scrollTo(0, 0);
    }

    // Top-level /docs index — no sidebar
    if (pathname === '/docs') {
      return createElement('div', null,
        createElement(DocsIndex, null),
      );
    }

    // Render with sidebar layout
    return createElement('div', null,
      createElement(DocsLayout, { currentPath: pathname },
        PageComponent
          ? createElement(PageComponent, null)
          : createElement('div', { className: 'py-16 text-center' },
            createElement('p', { className: 'text-muted-foreground' }, 'Page not found.'),
          ),
      ),
    );
  }
}
