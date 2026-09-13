import React from "react";
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import Hello from "./hello";

test('loads and displays greetings', () => {
    render(<Hello />)

    expect(screen.getByRole('heading')).toHaveTextContent('Hello there');
})