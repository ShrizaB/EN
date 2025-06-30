export interface ProgrammingQuestion {
    id: number
    title: string
    description: string
    constraints?: string
    examples: Array<{
      input: string
      output: string
      explanation?: string
    }>
    testCases: Array<{
      input: string
      expectedOutput: string
    }>
    hints?: string[]
    difficulty: "easy" | "medium" | "hard"
    language: string
    starterCode?: string
    solution?: string
  }
  
  export const programmingQuestions: ProgrammingQuestion[] = [
    {
      id: 1,
      title: "Sum of Two Numbers",
      description: `
        <p>Write a function that takes two numbers as input and returns their sum.</p>
        <p>Your function should be named <code>sum</code> and take two parameters:</p>
        <ul>
          <li><code>a</code>: the first number</li>
          <li><code>b</code>: the second number</li>
        </ul>
        <p>Return the sum of <code>a</code> and <code>b</code>.</p>
      `,
      examples: [
        {
          input: "5, 3",
          output: "8",
          explanation: "5 + 3 = 8",
        },
        {
          input: "-1, 1",
          output: "0",
          explanation: "-1 + 1 = 0",
        },
      ],
      testCases: [
        { input: "5, 3", expectedOutput: "8" },
        { input: "-1, 1", expectedOutput: "0" },
        { input: "0, 0", expectedOutput: "0" },
        { input: "100, 200", expectedOutput: "300" },
        { input: "-50, -30", expectedOutput: "-80" },
      ],
      hints: [
        "Use the addition operator (+) to add the two numbers.",
        "Make sure your function returns the result, not just prints it.",
      ],
      difficulty: "easy",
      language: "python",
      starterCode: `def sum(a, b):
      # Write your code here
      pass
  
  # Example usage (will be used for testing)
  if __name__ == "__main__":
      import sys
      a, b = map(int, sys.argv[1].split(", "))
      print(sum(a, b))
  `,
      solution: `def sum(a, b):
      return a + b
  
  # Example usage (will be used for testing)
  if __name__ == "__main__":
      import sys
      a, b = map(int, sys.argv[1].split(", "))
      print(sum(a, b))
  `,
    },
    {
      id: 2,
      title: "Find the Maximum Subarray Sum",
      description: `
        <p>Given an array of integers, find the contiguous subarray with the largest sum and return that sum.</p>
        <p>Your function should be named <code>maxSubArraySum</code> and take one parameter:</p>
        <ul>
          <li><code>nums</code>: an array of integers</li>
        </ul>
        <p>Return the maximum sum of a contiguous subarray within the given array.</p>
      `,
      constraints: `
        <ul>
          <li>The array will contain at least one element.</li>
          <li>The array may contain both positive and negative integers.</li>
        </ul>
      `,
      examples: [
        {
          input: "[-2, 1, -3, 4, -1, 2, 1, -5, 4]",
          output: "6",
          explanation: "The subarray [4, -1, 2, 1] has the largest sum = 6.",
        },
        {
          input: "[1]",
          output: "1",
          explanation: "The array has only one element, so the maximum subarray sum is 1.",
        },
        {
          input: "[-1]",
          output: "-1",
          explanation: "The array has only one element, so the maximum subarray sum is -1.",
        },
      ],
      testCases: [
        { input: "[-2, 1, -3, 4, -1, 2, 1, -5, 4]", expectedOutput: "6" },
        { input: "[1]", expectedOutput: "1" },
        { input: "[-1]", expectedOutput: "-1" },
        { input: "[5, 4, -1, 7, 8]", expectedOutput: "23" },
        { input: "[-2, -1]", expectedOutput: "-1" },
      ],
      hints: [
        "Consider using Kadane's algorithm for an efficient solution.",
        "Keep track of the current sum and the maximum sum seen so far.",
        "If the current sum becomes negative, reset it to zero.",
      ],
      difficulty: "medium",
      language: "python",
      starterCode: `def maxSubArraySum(nums):
      # Write your code here
      pass
  
  # Example usage (will be used for testing)
  if __name__ == "__main__":
      import sys, json
      nums = json.loads(sys.argv[1])
      print(maxSubArraySum(nums))
  `,
      solution: `def maxSubArraySum(nums):
      max_so_far = nums[0]
      max_ending_here = nums[0]
      
      for i in range(1, len(nums)):
          max_ending_here = max(nums[i], max_ending_here + nums[i])
          max_so_far = max(max_so_far, max_ending_here)
      
      return max_so_far
  
  # Example usage (will be used for testing)
  if __name__ == "__main__":
      import sys, json
      nums = json.loads(sys.argv[1])
      print(maxSubArraySum(nums))
  `,
    },
    {
      id: 3,
      title: "Longest Increasing Path in a Matrix",
      description: `
        <p>Given an m x n integers matrix, return the length of the longest increasing path in the matrix.</p>
        <p>From each cell, you can either move in four directions: left, right, up, or down. You cannot move diagonally or move outside the boundary (i.e., wrap-around is not allowed).</p>
        <p>Your function should be named <code>longestIncreasingPath</code> and take one parameter:</p>
        <ul>
          <li><code>matrix</code>: a 2D array of integers</li>
        </ul>
        <p>Return the length of the longest increasing path in the matrix.</p>
      `,
      constraints: `
        <ul>
          <li>m == matrix.length</li>
          <li>n == matrix[i].length</li>
          <li>1 <= m, n <= 200</li>
          <li>0 <= matrix[i][j] <= 2^31 - 1</li>
        </ul>
      `,
      examples: [
        {
          input: "[[9,9,4],[6,6,8],[2,1,1]]",
          output: "4",
          explanation: "The longest increasing path is [1, 2, 6, 9].",
        },
        {
          input: "[[3,4,5],[3,2,6],[2,2,1]]",
          output: "4",
          explanation: "The longest increasing path is [3, 4, 5, 6]. Moving diagonally is not allowed.",
        },
      ],
      testCases: [
        { input: "[[9,9,4],[6,6,8],[2,1,1]]", expectedOutput: "4" },
        { input: "[[3,4,5],[3,2,6],[2,2,1]]", expectedOutput: "4" },
        { input: "[[1]]", expectedOutput: "1" },
        { input: "[[1,2],[3,4]]", expectedOutput: "4" },
        { input: "[[7,8,9],[9,7,6],[7,2,3]]", expectedOutput: "6" },
      ],
      hints: [
        "Use depth-first search (DFS) with memoization to avoid redundant calculations.",
        "For each cell, explore all four directions and choose the path that gives the longest increasing sequence.",
        "Use dynamic programming to store the results of subproblems.",
      ],
      difficulty: "hard",
      language: "python",
      starterCode: `def longestIncreasingPath(matrix):
      # Write your code here
      pass
  
  # Example usage (will be used for testing)
  if __name__ == "__main__":
      import sys, json
      matrix = json.loads(sys.argv[1])
      print(longestIncreasingPath(matrix))
  `,
      solution: `def longestIncreasingPath(matrix):
      if not matrix:
          return 0
      
      rows, cols = len(matrix), len(matrix[0])
      # Memoization table
      memo = [[0 for _ in range(cols)] for _ in range(rows)]
      
      def dfs(i, j):
          # If we've already computed this cell, return the result
          if memo[i][j] != 0:
              return memo[i][j]
          
          # Directions: up, right, down, left
          directions = [(-1, 0), (0, 1), (1, 0), (0, -1)]
          
          # Start with path length of 1 (the cell itself)
          max_length = 1
          
          # Try all four directions
          for di, dj in directions:
              ni, nj = i + di, j + dj
              
              # Check if the new position is valid and the value is greater
              if 0 <= ni < rows and 0 <= nj < cols and matrix[ni][nj] > matrix[i][j]:
                  # Update max_length with the longest path from this direction
                  max_length = max(max_length, 1 + dfs(ni, nj))
          
          # Save the result in the memo table
          memo[i][j] = max_length
          return max_length
      
      # Find the longest path starting from each cell
      max_path = 0
      for i in range(rows):
          for j in range(cols):
              max_path = max(max_path, dfs(i, j))
      
      return max_path
  
  # Example usage (will be used for testing)
  if __name__ == "__main__":
      import sys, json
      matrix = json.loads(sys.argv[1])
      print(longestIncreasingPath(matrix))
  `,
    },
  ]
  