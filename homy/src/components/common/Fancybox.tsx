import React, { useRef, useEffect, PropsWithChildren } from 'react';

import { Fancybox as NativeFancybox } from '@fancyapps/ui';
import '@fancyapps/ui/dist/fancybox/fancybox.css';

import { OptionsType } from '@fancyapps/ui/types/Fancybox/options';

interface Props {
   options?: Partial<OptionsType>;
   delegate?: string;
}

const Fancybox = (props: PropsWithChildren<Props>) => {
   const containerRef = useRef<HTMLDivElement | null>(null);

   useEffect(() => {
      const container = containerRef.current;

      if (container) {
         const delegate = props.delegate || '[data-fancybox]';
         const options = props.options || {};

         NativeFancybox.bind(container, delegate, options);
      }

      return () => {
         if (container) {
            NativeFancybox.unbind(container);
            NativeFancybox.close();
         }
      };
   }, [props.delegate, props.options, props.children]);

   return <div ref={containerRef}>{props.children}</div>;
}

export default Fancybox;
