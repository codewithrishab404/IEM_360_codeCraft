// Library import
import { useState, useEffect } from "react";
import { app } from "@/firebase";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import {
  ColumnDef,
  useReactTable,
  getCoreRowModel,
  flexRender,
  getFilteredRowModel,
} from "@tanstack/react-table";
import { Link } from "react-router-dom";

// Components import
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";

// Icons import
import { FaExternalLinkAlt } from "react-icons/fa";
import { MdOutlineAdd } from "react-icons/md";

interface Driver {
  name: string;
  email: string;
  busName: string;
  mob: string;
  uid: string;
}

const columns: ColumnDef<Driver>[] = [
  {
    header: "Email",
    accessorKey: "email",
  },
  {
    header: "Name",
    accessorKey: "name",
  },
  {
    header: "Bus Name",
    accessorKey: "busName",
  },
  {
    header: "Mobile Number",
    accessorKey: "mob",
  },
  {
    header: "Details",
    accessorKey: "uid",
    cell: ({ row }) => (
      <Link to={row.getValue("uid")}>
        <FaExternalLinkAlt />
      </Link>
    ),
  },
];

function DriverManagement() {
  const db = getFirestore(app);
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const user = localStorage.getItem("user");

  const table = useReactTable({
    data: drivers,
    columns: columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });
  useEffect(() => {
    const fetchDrivers = async () => {
      try {
        setLoading(true);
        const querySnapshot = await getDocs(collection(db, "drivers"));
        const driversData = querySnapshot.docs.map((doc) => ({
          name: doc.get("name"),
          email: doc.get("email"),
          busName: doc.get("busName"),
          mob: doc.get("mob"),
          uid: doc.id,
          // ...doc.data(),
        })) as Driver[];
        setDrivers(driversData);
        console.log(driversData);
      } catch (error) {
        console.error("Error fetching drivers:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDrivers();
  }, []);

  useEffect(() => {
    table.getColumn("name")?.setFilterValue(search);
  }, [search, table]);

  return (
    <>
      <div className="h-full p-6">
        <p className="text-3xl font-semibold text-center">Manage Bus Drivers</p>
        <div className="flex justify-center my-6">
          <div className="flex w-full max-w-sm items-center space-x-2">
            <Input
              type="text"
              placeholder="Search Drivers by name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-white"
            />
          </div>
        </div>
        {user && JSON.parse(user).role === "admin" && (
          <Link
            to={`/dashboard/driver-manager/new`}
            className="flex justify-end"
          >
            <Button className="hover:cursor-pointer my-4">
              {<MdOutlineAdd size={24} />}Add new Driver
            </Button>
          </Link>
        )}
        {loading ? (
          "Loading..."
        ) : (
          <div>
            <Table className="bg-white p-4 rounded-lg opacity-60">
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <TableHead
                        key={header.id}
                        className="text-black font-bold"
                      >
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                      </TableHead>
                    ))}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {table.getRowModel().rows.length > 0 ? (
                  table.getRowModel().rows.map((row) => (
                    <TableRow key={row.id} className="hover:bg-gray-100">
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id}>
                          {typeof cell.column.columnDef.cell === "function"
                            ? cell.column.columnDef.cell(cell.getContext())
                            : cell.getValue()}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={columns.length} className="text-center">
                      No results found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </>
  );
}

export default DriverManagement;
