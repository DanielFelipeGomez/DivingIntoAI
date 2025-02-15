interface TableDataProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any[];
}

const TableData: React.FC<TableDataProps> = (data) => {
  // Obtener las columnas (keys del objeto)
  const columns = Object.keys(data);

  // Obtener el número de filas (longitud de cualquier array)
  const rowCount = data[columns[0]]?.length || 0;

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full table-auto border-collapse">
        <thead>
          <tr className="bg-gray-100">
            {columns.map((column) => (
              <th key={column} className="border px-4 py-2 text-left">
                {column}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: rowCount }).map((_, rowIndex) => (
            <tr key={rowIndex} className="hover:bg-gray-50">
              {columns.map((column) => (
                <td key={`${column}-${rowIndex}`} className="border px-4 py-2">
                  {data[column][rowIndex]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TableData;
