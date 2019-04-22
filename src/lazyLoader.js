import React, {Suspense, lazy} from 'react';

export const lazyLoader = (importComponent, indicator) => {
    const Component = lazy(importComponent);
    const Placeholder = () => <div/>;
    const Loader = indicator || Placeholder;
    return (props) => (
        <Suspense fallback={<Loader/>}>
            <Component {...props}/>
        </Suspense>
    )
};