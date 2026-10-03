import {IconBase, type IconProps} from '../IconBase';
import {ICON_PATHS} from '../registry';
export const IconStore = (p: IconProps) => <IconBase d={ICON_PATHS.store} {...p} />;
