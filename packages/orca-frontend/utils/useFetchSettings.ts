import axios from 'axios';
import theme, { Theme } from '../theme';
import { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setCommunityName, setCommunityLogo, setPrimaryColor, setCommunityLogoPublicId } from '../store/settings';
import { RootState } from '../store';

interface useFetchSettingsPayload {
  isSettingsFetching: boolean;
}

const useFetchSettings = (setTheme: (theme?: Theme) => void): useFetchSettingsPayload => {
  const settings = useSelector((state: RootState) => state.settings);
  const dispatch = useDispatch();
  const [isSettingsFetching, setIsSettingsFetching] = useState(true);
  const [values, setValues] = useState({
    communityLogo: null,
    communityName: null,
    primaryColor: null,
    communityLogoPublicId: null,
  });

  const updateTheme = useCallback(
    (primaryColor: string) => {
      const newTheme = { ...theme };
      newTheme.colors.general.primary = primaryColor;
      dispatch(setPrimaryColor(primaryColor));
      setTheme(newTheme);
    },
    [dispatch, setTheme]
  );

  useEffect(() => {
    updateTheme(settings.primaryColor);
  }, [settings.primaryColor, updateTheme]);

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data } = await axios.get('/settings');
        const { communityLogo, communityName, primaryColor, communityLogoPublicId } = data;
        setValues({
          communityLogo,
          communityName,
          primaryColor,
          communityLogoPublicId,
        });

        if (!communityLogo && !communityName && !primaryColor) {
          return;
        }

        if (primaryColor) {
          updateTheme(primaryColor);
        }

        if (communityName) {
          dispatch(setCommunityName(communityName));
        }

        if (communityLogo) {
          dispatch(setCommunityLogo(communityLogo));
        }

        if (communityLogoPublicId) {
          dispatch(setCommunityLogoPublicId(communityLogoPublicId));
        }
      } catch (error) {
        console.log('Fetching settings failed: ', error);
      } finally {
        setIsSettingsFetching(false);
      }
    };

    fetch();
  }, [setTheme, dispatch, updateTheme]);

  return { isSettingsFetching, ...values };
};

export default useFetchSettings;
