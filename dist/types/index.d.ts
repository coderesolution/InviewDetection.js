export default class InviewDetection {
    constructor(options?: {});
    defaultOptions: {
        elements: string;
        duration: number;
        delay: number;
        start: string;
        ease: string;
        stagger: number;
        animationFrom: {
            opacity: number;
            'will-change': string;
            y: number;
        };
        animationTo: {
            opacity: number;
            y: number;
        };
        screen: string;
        autoStart: boolean;
        registerGsap: boolean;
    };
    options: {
        elements: string;
        duration: number;
        delay: number;
        start: string;
        ease: string;
        stagger: number;
        animationFrom: {
            opacity: number;
            'will-change': string;
            y: number;
        };
        animationTo: {
            opacity: number;
            y: number;
        };
        screen: string;
        autoStart: boolean;
        registerGsap: boolean;
    };
    triggers: any[];
    animatedElements: any[];
    getOption(optionName: any): any;
    init(): void;
    registerGsap(): Promise<any>;
    start(): void;
    addScopedElements(parent: any, animatedElements: any): void;
    addChildElements(parent: any, animatedElements: any): void;
    findClosestParentOrderAttr(element: any): number | false;
    addSplitElements(parent: any, animatedElements: any): void;
    getSplitChildren(splitElementsParent: any): any[];
    addSplitElement(splitElement: any, animatedElements: any): void;
    orderAnimatedElements(animatedElements: any): void;
    animateElements(parent: any, animatedElements: any, index: any): void;
    debugMode(parent: any, animatedElements: any, animationFromProperties: any, animationToProperties: any, index: any): void;
    refresh(): void;
    stop(): void;
    restart(): void;
}
