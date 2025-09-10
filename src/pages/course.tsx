import { _posts } from 'src/_mock';
import { CONFIG } from 'src/config-global';

import { CourseView } from 'src/sections/course/view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <title>{`Course - ${CONFIG.appName}`}</title>

      <CourseView/>
    </>
  );
}
