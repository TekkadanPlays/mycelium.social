import { createElement } from 'inferno-create-element';

interface IconProps {
  className?: string;
  'aria-hidden'?: boolean;
}

type PathData = string | string[];

export function icon(paths: PathData, style: 'outline' | 'solid' = 'outline') {
  return function Icon(props: IconProps) {
    const { className = 'size-4', ...rest } = props;
    const pathArray = Array.isArray(paths) ? paths : [paths];

    const svgProps: Record<string, any> = {
      xmlns: 'http://www.w3.org/2000/svg',
      viewBox: '0 0 24 24',
      className,
      'aria-hidden': true,
      ...rest,
    };

    if (style === 'outline') {
      svgProps.fill = 'none';
      svgProps.stroke = 'currentColor';
      svgProps['stroke-width'] = '1.5';
    } else {
      svgProps.fill = 'currentColor';
    }

    return createElement(
      'svg',
      svgProps,
      ...pathArray.map((d) =>
        createElement('path', {
          ...(style === 'outline'
            ? { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', d }
            : { 'fill-rule': 'evenodd', 'clip-rule': 'evenodd', d }),
        })
      )
    );
  };
}

export type IconComponent = ReturnType<typeof icon>;
