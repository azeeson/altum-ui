import {IconBase, type IconProps} from '../IconBase';
import {ICON_PATHS} from '../registry';
export const IconMap = (p: IconProps) => <IconBase d={ICON_PATHS.map} {...p} />;
