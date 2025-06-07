// import { Package, Truck, User } from "lucide-react";
// import { ParcelList } from "../components/parcels/ParcelList";
// import { useEffect, useState } from "react";
// import api from "../lib/api";

// export default function DashboardPage() {
//   const [parcelsCount, setParcelsCount] = useState(0);
//   const [inTransitCount, setInTransitCount] = useState(0);
//   const [userCount, setUserCount] = useState(0);

//   useEffect(() => {
//     api.get("/parcels/count").then(res => {
//       setParcelsCount(res.data.count);
//     });
//   }, []);

//   useEffect(() => {
//     api.get("/auth/count").then(res => {
//       setUserCount(res.data.count);
//     });
//   }, []);

//   useEffect(()=> {
//     api.get("/parcels/inTransitCount").then(res=>{
//       setInTransitCount(res.data.count);
//     })
//   }, []);

//   // Stats
//   const stats = [
//     { label: "Total Parcels", value: parcelsCount, icon: <Package className="h-6 w-6 text-primary" /> },
//     { label: "In Transit", value: inTransitCount, icon: <Truck className="h-6 w-6 text-primary" /> },
//     { label: "Users", value: userCount, icon: <User className="h-6 w-6 text-primary" /> },
//   ];

//   return (
//     <div className="flex min-h-screen min-w-full bg-[hsl(var(--background))] text-[hsl(var(--foreground))]">
      
//       {/* Main Content Area */}
//       <div className="flex-1 flex flex-col min-h-screen">

//         {/* Main Scrollable Content */}
//         <main className="flex-1 p-6 overflow-y-auto">
//           <header className="mb-8">
//             <h1 className="text-3xl font-bold">Welcome to E-POST</h1>
//           </header>

//           {/* Stats Cards */}
//           <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
//             {stats.map((stat) => (
//               <div
//                 key={stat.label}
//                 className="bg-[hsl(var(--card))] dark:bg-[hsl(var(--card))] rounded-lg shadow shadow-black dark:shadow-white p-6 flex items-center gap-4"
//               >
//                 <div>{stat.icon}</div>  
//                 <div>
//                   <div className="text-2xl font-bold">{stat.value}</div>
//                   <div className="text-sm text-muted-foreground">{stat.label}</div>
//                 </div>
//               </div>
//             ))}
//           </section>

//           {/* Minimal Table Example */}
//           <section className="bg-[hsl(var(--card))] dark:bg-[hsl(var(--card))] rounded-lg shadow shadow-black dark:shadow-white p-6">
//             <ParcelList/>
//           </section>
//         </main>
//       </div>
//     </div>
//   );
// }

//----------------------------------------------------------------------------------------

import { useEffect, useState } from "react";
import { useParcels } from "../components/parcel-provider"; // ✅
import { ParcelList } from "../components/parcels/ParcelList";
import { Package, Truck, User } from "lucide-react";
import api from "../lib/api";

export default function DashboardPage() {
  const { fetchParcels } = useParcels(); // ✅
  const [parcelsCount, setParcelsCount] = useState(0);
  const [inTransitCount, setInTransitCount] = useState(0);
  const [userCount, setUserCount] = useState(0);

  useEffect(() => {
    fetchParcels(); // ✅ This will populate context used by <ParcelList />
  }, []);

  useEffect(() => {
    api.get("/parcels/count").then(res => {
      setParcelsCount(res.data.count);
    });
  }, []);

  useEffect(() => {
    api.get("/auth/count").then(res => {
      setUserCount(res.data.count);
    });
  }, []);

  useEffect(() => {
    api.get("/parcels/inTransitCount").then(res => {
      setInTransitCount(res.data.count);
    });
  }, []);

  const stats = [
    { label: "Total Parcels", value: parcelsCount, icon: <Package className="h-6 w-6 text-primary" /> },
    { label: "In Transit", value: inTransitCount, icon: <Truck className="h-6 w-6 text-primary" /> },
    { label: "Users", value: userCount, icon: <User className="h-6 w-6 text-primary" /> },
  ];

  return (
    <div className="flex min-h-screen min-w-full bg-[hsl(var(--background))] text-[hsl(var(--foreground))]">
      <div className="flex-1 flex flex-col min-h-screen">
        <main className="flex-1 p-6 overflow-y-auto">
          <header className="mb-8">
            <h1 className="text-3xl font-bold">Welcome to E-POST</h1>
          </header>

          <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="bg-[hsl(var(--card))] dark:bg-[hsl(var(--card))] rounded-lg shadow shadow-black dark:shadow-white p-6 flex items-center gap-4"
              >
                <div>{stat.icon}</div>
                <div>
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </div>
              </div>
            ))}
          </section>

          <section className="bg-[hsl(var(--card))] dark:bg-[hsl(var(--card))] rounded-lg shadow shadow-black dark:shadow-white p-6">
            <ParcelList />
          </section>
        </main>
      </div>
    </div>
  );
}
