// JavaScript to dynamically generate the blog list
const blogList = document.querySelector('ul');
const blogsDirectory = 'blogs/';

// Function to fetch the list of files in the blogs directory
async function getBlogFiles() {
    try {
        // Replace this with your actual method to fetch the file list
        // Fetch the list of blog files from the /list_blogs endpoint
        const response = await fetch('/list_blogs');
        const files = await response.json();

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
        blogList.textContent = 'Error: Could not load blog list.';
    }
}

// Call the function to generate the blog list
getBlogFiles();