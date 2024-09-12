'use client';

import { useParams } from 'next/navigation';
import Seo from '../../../components/Seo';
import { SettingsLayout } from '../../../components/Settings';
import SettingsAccount from '../../../components/Settings/SettingsAccount';
import SettingsAuthentication from '../../../components/Settings/SettingsAuthentication';
import SettingsCommunity from '../../../components/Settings/SettingsCommunity';
import SettingsUsers from '../../../components/Settings/SettingsUsers';
import { UserRole } from '../../../constants';

const pages = {
  community: {
    title: 'Community Settings',
    component: <SettingsCommunity />,
    authType: UserRole.Admin,
  },
  account: {
    title: 'Account Settings',
    component: <SettingsAccount />,
    authType: UserRole.Regular,
  },
  authentication: {
    title: 'Authentication Settings',
    component: <SettingsAuthentication />,
    authType: UserRole.Regular,
  },
  users: {
    title: 'Community Users',
    component: <SettingsUsers />,
    authType: UserRole.SuperAdmin,
  },
};

const Settings = () => {
  const p = useParams();
  const name = p.name;

  if (!name) {
    return null;
  }

  const currentPageName = typeof name === 'string' ? name : name[0];

  const currentPage = pages[currentPageName].component;
  const currentTile = pages[currentPageName].title;

  return (
    <SettingsLayout>
      <Seo title={currentTile} />
      {currentPage}
    </SettingsLayout>
  );
};

/* such logic should be put in middleware.ts */
// export const getServerSideProps: GetServerSideProps = async ({
//   req,
//   params,
// }) => {
//   const name = params.name as string
//   const isAuth = await isAuthorized(req, pages[name].authType)
//   if (!isAuth) {
//     return redirectToHome()
//   }

//   return { props: {} }
// }

export default Settings;
