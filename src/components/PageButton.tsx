import { PageButtonOptions, PageButtonProps } from "../utils/types"

const PageButton = ({children, clickHandler, isActive}:PageButtonProps) => {

const pageButtonOptions :PageButtonOptions = {
    true: "bg-gray-300 text-gray-900",
    false: "bg-gray-900 text-gray-300 hover:bg-gray-300 hover:text-gray-900 active:bg-orange-500"
}

  return (
    <div className={`px-4 py-2 cursor-pointer rounded-lg  transition-all duration-100 ${pageButtonOptions[isActive]}`} onClick={clickHandler}>
      {children}
    </div>
  )
}

export default PageButton
