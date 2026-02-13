package com.teatroreal.service.tops;

import com.teatroreal.domain.tops.GuionImage;
import com.teatroreal.repository.tops.GuionImageRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.io.TempDir;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.util.ReflectionTestUtils;

import java.nio.file.Files;
import java.nio.file.Path;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
public class GuionImageServiceTest {

    @Mock
    private GuionImageRepository guionImageRepository;

    private GuionImageService guionImageService;

    @TempDir
    Path tempDir;

    @BeforeEach
    public void setUp() {
        guionImageService = new GuionImageService(guionImageRepository);
        // Set upload dir to temporary directory to avoid writing into repo workspace
        ReflectionTestUtils.setField(guionImageService, "uploadBaseDir", tempDir.toString());
        // Keep maxFileSize small for tests (2 KB)
        ReflectionTestUtils.setField(guionImageService, "maxFileSize", 2048L);
    }

    @Test
    public void uploadImage_validImage_savesAndWritesCopy() throws Exception {
        MockMultipartFile file = new MockMultipartFile(
                "file",
                "image.png",
                "image/png",
                "sample-content".getBytes()
        );

        when(guionImageRepository.save(any(GuionImage.class))).thenAnswer(invocation -> {
            GuionImage img = invocation.getArgument(0);
            img.setId(1L);
            return img;
        });

        GuionImage saved = guionImageService.uploadImage(file, "g1", "TOP", "e1", 99L);

        assertNotNull(saved);
        assertEquals(1L, saved.getId());
        assertEquals("image/png", saved.getMimeType());
        // Check that copy was written to filesystem: {tempDir}/g1/1_image.png
        Path expected = tempDir.resolve("g1").resolve("1_image.png");
        assertTrue(Files.exists(expected), "Expected filesystem copy to exist: " + expected);
        byte[] written = Files.readAllBytes(expected);
        assertArrayEquals("sample-content".getBytes(), written);
    }

    @Test
    public void uploadImage_invalidMime_throws() {
        MockMultipartFile file = new MockMultipartFile(
                "file",
                "doc.txt",
                "text/plain",
                "text".getBytes()
        );

        assertThrows(IllegalArgumentException.class, () ->
                guionImageService.uploadImage(file, "g1", "TOP", "e1", 1L)
        );
    }

    @Test
    public void uploadImage_tooLarge_throws() {
        // Set very small maxFileSize to trigger size validation
        ReflectionTestUtils.setField(guionImageService, "maxFileSize", 1L); // 1 byte

        MockMultipartFile file = new MockMultipartFile(
                "file",
                "big.png",
                "image/png",
                new byte[10] // 10 bytes > 1
        );

        assertThrows(IllegalArgumentException.class, () ->
                guionImageService.uploadImage(file, "g1", "TOP", "e1", 1L)
        );
    }
}
