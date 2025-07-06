// JavaScript to dynamically generate the blog list
// Get the blog list element
const blogList = document.querySelector('ul');
const blogsDirectory = 'blogs/';

// Function to fetch the list of files in the blogs directory
async function getBlogFiles() {
    // Show loading indicator
    blogList.textContent = 'Loading...';

    try {
        // Fetch the list of blog files from the /list_blogs endpoint
        const response = await fetch('/list_blogs');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const files = await response.json();

        // Clear loading indicator
        blogList.textContent = '';

        // Iterate over the files and create list items
        files.forEach(file => {
            const listItem = document.createElement('li');
            const link = document.createElement('a');
            link.href = blogsDirectory + file;
            link.textContent = file;
            listItem.appendChild(link);
            blogList.appendChild(listItem);
        });
    } catch (error) {
        console.error('Error fetching blog files:', error);
        blogList.textContent = `Error: Could not load blog list. ${error}`;
    }
}

// Call the function to generate the blog list
getBlogFiles();