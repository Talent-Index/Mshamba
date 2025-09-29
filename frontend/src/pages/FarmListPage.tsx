import React from 'react';
import { useSuiClient } from '@mysten/dapp-kit';
import { useQuery } from '@tanstack/react-query';
import { PACKAGE_ID } from '../constants';
import { Link } from 'react-router-dom';
import './FarmListPage.css';

interface FarmObject {
  data: {
    objectId: string;
    version: string;
    digest: string;
    content: {
      dataType: string;
      type: string;
      hasPublicTransfer: boolean;
      fields: {
        id: { id: string };
        farmer: string;
        investors: any[]; // We'll refine this later
        total_invested: string; // u64 comes as string
        vault: { fields: { balance: string } }; // balance comes as string
      };
    };
  };
  error?: any;
}

const FarmListPage: React.FC = () => {
  const suiClient = useSuiClient();

  const { data: farms, isLoading, error } = useQuery<FarmObject[]>({ 
    queryKey: ['farms'],
    queryFn: async () => {
      if (!PACKAGE_ID || PACKAGE_ID === "YOUR_PACKAGE_ID_HERE") {
        throw new Error("Please replace YOUR_PACKAGE_ID_HERE in src/constants.ts with your actual package ID.");
      }
      const objects = await suiClient.getOwnedObjects({
        owner: "0x0", // This will fetch all shared objects, which farms are.
        filter: {
          StructType: `${PACKAGE_ID}::farm::Farm`,
        },
        options: { showContent: true, showDisplay: true },
      });

      // Filter out objects that are not of the expected type or have errors
      const validFarms = objects.data.filter(obj => 
        obj.data?.content?.dataType === 'moveObject' && 
        obj.data.content.type === `${PACKAGE_ID}::farm::Farm`
      ) as FarmObject[];

      return validFarms;
    },
    refetchInterval: 5000,
  });

  if (isLoading) return <div>Loading farms...</div>;
  if (error) return <div>Error loading farms: {error.message}</div>;

  return (
    <div className="farm-list-container">
      <h2>All Farms</h2>
      {farms && farms.length > 0 ? (
        <ul>
          {farms.map((farm) => (
            <li key={farm.data.objectId}>
              <Link to={`/farms/${farm.data.objectId}`}>
                <h3>Farm ID: {farm.data.objectId}</h3>
                <p>Farmer: {farm.data.content.fields.farmer}</p>
                <p>Total Invested: {parseInt(farm.data.content.fields.total_invested) / 1_000_000_000} SUI</p>
                <p>Vault Balance: {parseInt(farm.data.content.fields.vault.fields.balance) / 1_000_000_000} SUI</p>
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <p className="no-farms-message">No farms found. Be the first to create one!</p>
      )}
    </div>
  );
};

export default FarmListPage;
