import { db } from "@/lib/db"
import { Categories } from "./_components/categories"

const SearchPage=async()=>{
    const categories=await db.category.findMany({
        orderBy:{
            name:"asc"
        }
    })

    console.log(categories)
    return (
        <div className="p-6">
            hello from search page
            <Categories
            items={categories}
            />
        </div>
    )
}

export default SearchPage