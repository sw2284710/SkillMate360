import { _posts } from 'src/_mock';
import { CONFIG } from 'src/config-global';

import { ControlPanelView } from 'src/sections/control-panel/view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <title>{`Control Panel - ${CONFIG.appName}`}</title>

      <ControlPanelView/>
    </>
  );
}
