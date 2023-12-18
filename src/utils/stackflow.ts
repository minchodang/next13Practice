import { basicUIPlugin } from '@stackflow/plugin-basic-ui';
import '@stackflow/plugin-basic-ui/index.css';
import { basicRendererPlugin } from '@stackflow/plugin-renderer-basic';
import { stackflow } from '@stackflow/react';
import SecondStack from '@/components/stack/SecondStack';

export const { Stack, useFlow } = stackflow({
    transitionDuration: 350,
    activities: {
        SecondStack,
    },
    plugins: [
        basicRendererPlugin(),
        basicUIPlugin({
            theme: 'cupertino',
        }),
    ],
    initialActivity: () => 'SecondStack',
});
