import {
  AccountCircle as AccountCircleIcon,
  AcUnit as AcUnitIcon,
  LocalFlorist as AgricultureIcon,
  Air as AirIcon,
  ArrowForward as ArrowForwardIcon,
  ArrowForwardIos as ArrowForwardIosIcon,
  BarChart as BarChartIcon,
  BugReport as BugReportIcon,
  CameraAlt as CameraAltIcon,
  Chat as ChatIcon,
  CheckCircle as CheckCircleIcon,
  Cloud as CloudIcon,
  CloudQueue as CloudQueueIcon,
  Park as EcoIcon,
  Edit as EditIcon,
  Email as EmailIcon,
  FlashOn as FlashOnIcon,
  WbCloudy as FoggyIcon,
  GpsFixed as GpsFixedIcon,
  Grain as GrainIcon,
  Home as HomeIcon,
  HourglassEmpty as HourglassEmptyIcon,
  Language as LanguageIcon,
  LocationOn as LocationOnIcon,
  LocationSearching as LocationSearchingIcon,
  Lock as LockIcon,
  MyLocation as MyLocationIcon,
  Opacity as OpacityIcon,
  Person as PersonIcon,
  PersonOutline as PersonOutlineIcon,
  Phone as PhoneIcon,
  Science as ScienceIcon,
  Send as SendIcon,
  Storage as StorageIcon,
  Straighten as StraightenIcon,
  Thermostat as ThermostatIcon,
  Timeline as TrackChangesIcon,
  TrendingUp as TrendingUpIcon,
  Umbrella as UmbrellaIcon,
  UploadFile as UploadFileIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  Warning as WarningIcon,
  WaterDrop as WaterDropIcon,
  WbSunny as WbSunnyIcon,
} from '@mui/icons-material';
import React from 'react';

// Icon name mapping
const iconMap: Record<string, React.ComponentType<any>> = {
  'agriculture': AgricultureIcon,
  'language': LanguageIcon,
  'email': EmailIcon,
  'lock': LockIcon,
  'visibility': VisibilityIcon,
  'visibility-off': VisibilityOffIcon,
  'account-circle': AccountCircleIcon,
  'person-outline': PersonOutlineIcon,
  'home': HomeIcon,
  'wb-sunny': WbSunnyIcon,
  'storage': StorageIcon,
  'eco': EcoIcon,
  'bug-report': BugReportIcon,
  'trending-up': TrendingUpIcon,
  'bar-chart': BarChartIcon,
  'track-changes': TrackChangesIcon,
  'person': PersonIcon,
  'phone': PhoneIcon,
  'science': ScienceIcon,
  'send': SendIcon,
  'straighten': StraightenIcon,
  'my-location': MyLocationIcon,
  'location-searching': LocationSearchingIcon,
  'hourglass-empty': HourglassEmptyIcon,
  'location-on': LocationOnIcon,
  'edit': EditIcon,
  'gps-fixed': GpsFixedIcon,
  'upload-file': UploadFileIcon,
  'camera-alt': CameraAltIcon,
  'arrow-forward-ios': ArrowForwardIosIcon,
  'arrow-forward': ArrowForwardIcon,
  'chat': ChatIcon,
  'warning': WarningIcon,
  'water-drop': WaterDropIcon,
  'thermostat': ThermostatIcon,
  'opacity': OpacityIcon,
  'grain': GrainIcon,
  'air': AirIcon,
  'check-circle': CheckCircleIcon,
  'cloud-queue': CloudQueueIcon,
  'cloud': CloudIcon,
  'foggy': FoggyIcon,
  'ac-unit': AcUnitIcon,
  'umbrella': UmbrellaIcon,
  'flash-on': FlashOnIcon,
};

interface IconProps {
  name: string;
  size?: number;
  color?: string;
  style?: React.CSSProperties;
}

export const Icon: React.FC<IconProps> = ({ name, size = 24, color = '#000', style }) => {
  try {
    const IconComponent = iconMap[name];
    if (!IconComponent) {
      console.warn(`Icon "${name}" not found`);
      const fallbackStyle: React.CSSProperties = { fontSize: size, color };
      if (style && typeof style === 'object' && !Array.isArray(style)) {
        Object.assign(fallbackStyle, style);
      }
      return <span style={fallbackStyle}>?</span>;
    }
    // Use sx for MUI styling instead of style to avoid CSSStyleDeclaration issues
    const sxProps = {
      fontSize: size,
      color,
      ...(style && typeof style === 'object' && !Array.isArray(style) ? style : {}),
    };
    return <IconComponent sx={sxProps} />;
  } catch (error) {
    console.error(`Error rendering icon "${name}":`, error);
    const fallbackStyle: React.CSSProperties = { fontSize: size, color };
    if (style && typeof style === 'object' && !Array.isArray(style)) {
      Object.assign(fallbackStyle, style);
    }
    return <span style={fallbackStyle}>?</span>;
  }
};

export default Icon;

