import { Skeleton } from "../skeleton"
const TableSkeletonComponent = () => {

    return (
        <div className="border border-gray-100 rounded-md bg-white p-5 flex-1">
            <div className="flex justify-between gap-3 mb-3 ">
                <Skeleton className="h-5 w-[20%]" />
                <Skeleton className="h-5 w-[20%]" />
            </div>
            <hr className="mb-3" />
            {
                Array.from({ length: 8 }).map((_, index) =>
                (
                    <div className="flex justify-between gap-3 mb-3" key={index}>
                        <Skeleton className="h-5 w-[20%]" />
                        <Skeleton className="h-5 w-[20%]" />
                        <Skeleton className="h-5 w-[20%]" />
                        <Skeleton className="h-5 w-[20%]" />
                        <Skeleton className="h-5 w-[20%]" />
                    </div>
                ))
            }
        </div>

    )
}

export default TableSkeletonComponent;