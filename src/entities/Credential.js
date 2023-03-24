// @flow
class Credential{
    name;
    spaceId;
    spaceToken;
    broadcastId;
    vonageApikey;
    vonageSessionId;
    vonageToken;
  
    constructor(name, spaceId, spaceToken, broadcastId, vonageApikey, vonageSessionId, vonageToken){
      this.name = name
      this.spaceId = spaceId;
      this.spaceToken = spaceToken;
      this.broadcastId = broadcastId;
      this.vonageApikey = vonageApikey;
      this.vonageSessionId = vonageSessionId;
      this.vonageToken = vonageToken;
    }
  }
  export default Credential;