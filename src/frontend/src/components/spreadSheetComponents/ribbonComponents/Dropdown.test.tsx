import Dropdown from "./Dropdown"
import { render, screen, fireEvent } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { Functions } from "../../../utils/types"
// @author Robert Roach

describe("Dropdown tests", () => {

    const functionList = [Functions.SUM, Functions.AVG]

    test("Test that component renders", async () => {

        render(<Dropdown
            buttonLabel={'Functions'}
            listItems={functionList}
        />)

        expect(await screen.findByText("Functions")).toBeInTheDocument()
    })

    // Tests handleSelectFunction function prop
    test("Test function dropdown, select dropdown button", async () => {

        render(<Dropdown
            buttonLabel={'Functions'}
            listItems={functionList}
        />)
        const dropdownButton = await screen.findByText("Functions")
        userEvent.click(dropdownButton)

        // Find and click a dropdown button
        const sumButton = await screen.findByText("SUM")
        expect(sumButton).toBeInTheDocument()
        await userEvent.click(sumButton)

        setTimeout(() => {}, 100)

        // Selecting button closes menu
        expect(screen.queryByText("SUM")).not.toBeInTheDocument()
    })

    // Tests onBlur and toggleDropdown
    test("Test clicking away when dropdown open closes the dropdown", async () => {

        render(<Dropdown
            buttonLabel={'Functions'}
            listItems={functionList}
        />)
        const dropdownButton = await screen.findByText("Functions")
        userEvent.click(dropdownButton)

        // Find and click a dropdown button
        const sumButton = await screen.findByText("SUM")
        expect(sumButton).toBeInTheDocument()
        fireEvent.blur(dropdownButton)

        // Dropdown menu closed
        expect(screen.queryByText("SUM")).not.toBeInTheDocument()
    })
})