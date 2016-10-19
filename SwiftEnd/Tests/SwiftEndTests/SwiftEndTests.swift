import XCTest
@testable import SwiftEnd

class SwiftEndTests: XCTestCase {
    func testExample() {
        // This is an example of a functional test case.
        // Use XCTAssert and related functions to verify your tests produce the correct results.
        XCTAssertEqual(SwiftEnd().text, "Hello, World!")
    }


    static var allTests : [(String, (SwiftEndTests) -> () throws -> Void)] {
        return [
            ("testExample", testExample),
        ]
    }
}
