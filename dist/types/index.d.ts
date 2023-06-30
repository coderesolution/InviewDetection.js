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
        inviewClass: string;
        viewedClass: string;
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
        inviewClass: string;
        viewedClass: string;
    };
    triggers: any[];
    animatedElements: any[];
    listeners: {};
    getOption(optionName: any): any;
    init(): void;
    on(eventName: any, listener: any): void;
    emit(eventName: any, element: any): void;
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
