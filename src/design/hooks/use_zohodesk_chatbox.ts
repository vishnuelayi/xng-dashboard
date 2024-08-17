import React from "react";


const useZohodeskChatbox = () => {
  const zohoDeskBTn = React.useRef<HTMLButtonElement | null>(null)

  React.useEffect(() => {
    zohoDeskBTn.current = document.querySelector('[data-id="zsalesiq"]') as HTMLButtonElement;
  }, []);

  function show() {
    if(zohoDeskBTn.current) zohoDeskBTn.current?.click();
    else (zohoDeskBTn.current = document.querySelector('[data-id="zsalesiq"]') as HTMLButtonElement)?.click();
  }   

  return ({
    show,
    triggerBtn: zohoDeskBTn.current
  })
}

export default useZohodeskChatbox
