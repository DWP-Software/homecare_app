export const getBase64FromUrl = async (url, token) => {
    console.log('url', token)
    const data = await fetch(url, { 
        method: 'get', 
        headers: new Headers({
            'Authorization': token, 
        })});
    console.log('data', data)
    const blob = await data.blob();
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.readAsDataURL(blob); 
      reader.onloadend = function() {
        const base64data = reader.result;   
        resolve(base64data);
      }
    });
  }

