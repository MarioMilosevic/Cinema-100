import { PageButtonProps } from "../utils/types"

const PageButton = ({children, clickHandler}:PageButtonProps) => {

  return (
    <div className="bg-gray-800 text-gray-100 px-4 py-2 rounded-lg transition-all duration-100 hover:bg-gray-300 hover:text-gray-900" onClick={clickHandler}>
      {children}
    </div>
  )
}

export default PageButton
