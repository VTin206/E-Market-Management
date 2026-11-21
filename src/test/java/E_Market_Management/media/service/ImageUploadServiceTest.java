package E_Market_Management.media.service;

import static org.junit.jupiter.api.Assertions.*;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.Base64;
import java.util.UUID;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.io.TempDir;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.ValueSource;
import org.springframework.mock.web.MockMultipartFile;

class ImageUploadServiceTest {
    private static final int MAX_FILE_SIZE = 5 * 1024 * 1024;
    private static final byte[] PNG = Base64.getDecoder().decode(
        "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+aB9sAAAAASUVORK5CYII="
    );

    @TempDir
    Path directory;

    @Test
    void store_whenDirectoryDoesNotExist_createsItAndPreservesImageBytes() throws IOException {
        Path destination = directory.resolve("images");
        ImageUploadService service = new ImageUploadService(destination.toString());

        String filename = service.store(png("photo.png"));

        assertTrue(filename.endsWith(".png"));
        assertDoesNotThrow(() -> UUID.fromString(filename.substring(0, filename.length() - 4)));
        assertArrayEquals(PNG, Files.readAllBytes(destination.resolve(filename)));
    }

    @Test
    void store_whenFileIsNull_rejectsWithoutWriting() throws IOException {
        ImageUploadService service = new ImageUploadService(directory.toString());

        assertThrows(IllegalArgumentException.class, () -> service.store(null));
        assertDirectoryEmpty();
    }

    @Test
    void store_whenFileIsEmpty_rejectsWithoutWriting() throws IOException {
        ImageUploadService service = new ImageUploadService(directory.toString());
        MockMultipartFile file = new MockMultipartFile("file", "empty.png", "image/png", new byte[0]);

        assertThrows(IllegalArgumentException.class, () -> service.store(file));
        assertDirectoryEmpty();
    }

    @Test
    void store_whenFileExceedsLimit_rejectsWithoutWriting() throws IOException {
        ImageUploadService service = new ImageUploadService(directory.toString());
        MockMultipartFile file = new MockMultipartFile(
            "file", "large.png", "image/png", new byte[MAX_FILE_SIZE + 1]
        );

        IllegalArgumentException error = assertThrows(IllegalArgumentException.class, () -> service.store(file));

        assertTrue(error.getMessage().contains("5 MB"));
        assertDirectoryEmpty();
    }

    @Test
    void store_whenFileIsExactlyAtLimit_acceptsIt() throws IOException {
        ImageUploadService service = new ImageUploadService(directory.toString());
        byte[] content = new byte[MAX_FILE_SIZE];
        System.arraycopy(PNG, 0, content, 0, PNG.length);
        MockMultipartFile file = new MockMultipartFile("file", "limit.png", "image/png", content);

        String filename = service.store(file);

        assertEquals(MAX_FILE_SIZE, Files.size(directory.resolve(filename)));
        assertArrayEquals(content, Files.readAllBytes(directory.resolve(filename)));
    }

    @ParameterizedTest
    @ValueSource(strings = {"text/html", "image/svg+xml", "application/octet-stream"})
    void store_whenContentTypeIsUnsupported_rejectsEvenWithPngFilename(String contentType) throws IOException {
        ImageUploadService service = new ImageUploadService(directory.toString());
        MockMultipartFile file = new MockMultipartFile("file", "photo.png", contentType, PNG);

        assertThrows(IllegalArgumentException.class, () -> service.store(file));
        assertDirectoryEmpty();
    }

    @Test
    void store_whenOriginalNameContainsTraversal_usesGeneratedNameInsideUploadDirectory() throws IOException {
        Path destination = directory.resolve("images");
        ImageUploadService service = new ImageUploadService(destination.toString());

        String filename = service.store(png("../escaped.png"));

        assertEquals(Path.of(filename).getFileName().toString(), filename);
        assertTrue(Files.isRegularFile(destination.resolve(filename)));
        assertFalse(Files.exists(directory.resolve("escaped.png")));
    }

    @Test
    void store_whenOriginalNamesMatch_keepsBothUploads() throws IOException {
        ImageUploadService service = new ImageUploadService(directory.toString());

        String first = service.store(png("photo.png"));
        String second = service.store(png("photo.png"));

        assertNotEquals(first, second);
        assertArrayEquals(PNG, Files.readAllBytes(directory.resolve(first)));
        assertArrayEquals(PNG, Files.readAllBytes(directory.resolve(second)));
        try (var files = Files.list(directory)) {
            assertEquals(2, files.count());
        }
    }

    @Test
    void store_whenDestinationIsAFile_reportsStorageFailureWithoutOverwritingIt() throws IOException {
        Path destination = directory.resolve("not-a-directory");
        Files.writeString(destination, "existing content");
        ImageUploadService service = new ImageUploadService(destination.toString());

        IllegalStateException error = assertThrows(IllegalStateException.class, () -> service.store(png("photo.png")));

        assertInstanceOf(IOException.class, error.getCause());
        assertEquals("existing content", Files.readString(destination));
    }

    private MockMultipartFile png(String name) {
        return new MockMultipartFile("file", name, "image/png", PNG);
    }

    private void assertDirectoryEmpty() throws IOException {
        try (var files = Files.list(directory)) {
            assertEquals(0, files.count());
        }
    }
}
