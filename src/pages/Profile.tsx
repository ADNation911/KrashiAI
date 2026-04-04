import React from 'react';
import { useLanguage } from '../context/LanguageContext';

const Profile: React.FC = () => {
  const { t } = useLanguage();
  
  return (
    <div style={{ padding: '20px' }}>
      <h1>{t.profile}</h1>
      <p>Profile page - Full conversion pending</p>
    </div>
  );
};

export default Profile;


