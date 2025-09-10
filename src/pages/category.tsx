import { _posts } from 'src/_mock';
import { CONFIG } from 'src/config-global';

import { CategoryView } from 'src/sections/category/view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <title>{`Category - ${CONFIG.appName}`}</title>

      <CategoryView/>
    </>
  );
}
