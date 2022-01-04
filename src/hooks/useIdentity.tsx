import { Client, Identity, PrivateKey, Users } from "@textile/hub";
import { useEffect, useState } from "react";
import { getIdentity, keyInfo } from "../textile";

/**
 * Hook to a client instance, lists of users and identity from admin/developers.
 * 
 * Copied from https://github.com/molimauro/blockchain-developer-bootcamp-final-project/blob/791a36de1897d4f2fe18c4a1033b1e5e7ae6c73c/client/src/hooks/useIdentity.tsx
 * 
 * @returns {Object}
 * @returns {Client} client
 * @returns {Users} users
 * @returns {Identity} identity
 */
const useIdentity = (): { client: Client, users: Users, identity: Identity } => {
  const [id, setId] = useState<{
    identity: PrivateKey;
    users: Users;
    client: Client;
  }>({ users: null!, client: null!, identity: null! });

  const fetchIdentity = async () => {
    const client = await Client.withKeyInfo(keyInfo);
    const users = await Users.withKeyInfo(keyInfo);
    const identity = getIdentity();
    await users.getToken(identity);
    await client.getToken(identity);
    // Save data to the app state.
    setId({ client, users, identity });
  };

  useEffect(() => {
    fetchIdentity();
  });

  return id;
};

export default useIdentity;