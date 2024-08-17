import React from 'react'
import { ServiceProviderRef } from '../../../../profile-sdk';

const useSelectedProvidersHandler = (props:{
    onChangeSelectedProviderIds:(selectedProviderIds: string[]) => void,
    providers: ServiceProviderRef[],
}) => {
    const {onChangeSelectedProviderIds, providers} = props
    const [selectedProviders, setSelectedProviders] = React.useState(providers);
  
    const setSelectedProvidersHandler = (selected: ServiceProviderRef[]) => {
      setSelectedProviders(selected);
      onChangeSelectedProviderIds(selected.map((p) => p.id || ""));
    };
  
  return {selectedProviders, 
    setSelectedProviders:setSelectedProvidersHandler}
}

export default useSelectedProvidersHandler