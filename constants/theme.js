
//import { opacity } from "react-native-reanimated/lib/typescript/reanimated2/Colors";
export const theme = {
    colors: {
        white: '#fff',
        black: '#000',
        grayBG: '#e5e5e5',
        seaBlue: '#52a9ff',
        primary: '#fbbf24',
        s_primary : '#FF6347',
        //neutral
        white_opa: (opacity) => `rgba(255,255,255,${opacity})`,
        neutral: (opacity)=> `rgba(10, 10, 10, ${opacity})`,
    },
    fontWeights:{
        medium: '500',
        semibold: '600',
        bold: '700',
    },
    radius: {
        xs: 10,
        sm: 12,
        md: 14,
        lg: 16,
        xl: 18,
    }
}